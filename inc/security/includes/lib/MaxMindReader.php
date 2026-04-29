<?php
namespace MadeIT\Security;

defined( 'ABSPATH' ) || exit;

/**
 * Pure-PHP MaxMind MMDB (GeoIP2) binary database reader.
 *
 * Implements the MMDB binary format specification for reading GeoLite2 databases
 * without requiring any PHP extensions or Composer dependencies.
 *
 * This file performs low-level binary I/O (fopen, fread, fseek, fclose) to parse
 * the MMDB binary format. WP_Filesystem cannot be used here because it does not
 * support binary seek/read operations required for the MMDB data structure.
 *
 * phpcs:disable WordPress.WP.AlternativeFunctions.file_system_operations_fopen
 * phpcs:disable WordPress.WP.AlternativeFunctions.file_system_operations_fread
 * phpcs:disable WordPress.WP.AlternativeFunctions.file_system_operations_fclose
 * phpcs:disable WordPress.WP.AlternativeFunctions.file_system_operations_fseek
 * phpcs:disable WordPress.WP.AlternativeFunctions.file_system_operations_filesize
 * phpcs:disable WordPress.Security.EscapeOutput.ExceptionNotEscaped
 *
 * @link https://maxmind.github.io/MaxMind-DB/
 */
class MaxMindReader {

    private const METADATA_MARKER = "\xab\xcd\xefMaxMind.com";
    private const DATA_TYPE_MAP   = 7;

    /** @var resource */
    private $fh;

    private string $filepath;
    private int    $file_size;

    // Metadata fields
    private int    $node_count;
    private int    $record_size;   // bits per record (24, 28, or 32)
    private int    $node_byte_size;
    private int    $tree_size;
    private int    $data_section_offset;
    private int    $ip_version;
    private string $db_type;
    private int    $build_epoch;

    /**
     * @throws \RuntimeException If the file cannot be opened or is invalid.
     */
    public function __construct( string $filepath ) {
        if ( ! is_file( $filepath ) || ! is_readable( $filepath ) ) {
            throw new \RuntimeException( "MMDB file not found or not readable: $filepath" );
        }

        $this->filepath  = $filepath;
        $this->file_size = (int) filesize( $filepath );

        $this->fh = fopen( $filepath, 'rb' );
        if ( ! $this->fh ) {
            throw new \RuntimeException( "Cannot open MMDB file: $filepath" );
        }

        $this->parse_metadata();
    }

    public function __destruct() {
        $this->close();
    }

    public function close(): void {
        if ( is_resource( $this->fh ) ) {
            fclose( $this->fh );
        }
    }

    /**
     * Look up an IP address.
     *
     * @param string $ip IPv4 or IPv6 address.
     * @return array|null Data record or null if not found.
     */
    public function get( string $ip ): ?array {
        $packed = @inet_pton( $ip );
        if ( $packed === false ) {
            return null;
        }

        // Convert IPv4 to IPv4-mapped IPv6 for IPv6-only databases
        if ( strlen( $packed ) === 4 && $this->ip_version === 6 ) {
            $packed = "\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xff" . $packed;
        }

        $bit_count = strlen( $packed ) * 8;
        $node      = 0;

        for ( $i = 0; $i < $bit_count; $i++ ) {
            if ( $node >= $this->node_count ) {
                break;
            }

            $byte = ord( $packed[ (int) ( $i / 8 ) ] );
            $bit  = 1 & ( $byte >> ( 7 - ( $i % 8 ) ) );

            $node = $this->read_node( $node, $bit );
        }

        // node_count means "not found"
        if ( $node === $this->node_count ) {
            return null;
        }

        // node > node_count means data pointer
        if ( $node > $this->node_count ) {
            $pointer = $node - $this->node_count - 16;
            $offset  = $this->data_section_offset + $pointer;
            [ $data ] = $this->decode( $offset );
            return is_array( $data ) ? $data : null;
        }

        return null;
    }

    /**
     * Return database metadata.
     */
    public function metadata(): array {
        return [
            'node_count'  => $this->node_count,
            'record_size' => $this->record_size,
            'ip_version'  => $this->ip_version,
            'db_type'     => $this->db_type,
            'build_epoch' => $this->build_epoch,
        ];
    }

    // ── Internal ──────────────────────────────────────────────────────────

    /**
     * Read a node record (left = 0, right = 1).
     */
    private function read_node( int $node_number, int $index ): int {
        $offset = $node_number * $this->node_byte_size;

        switch ( $this->record_size ) {
            case 24:
                fseek( $this->fh, $offset + $index * 3 );
                $bytes = fread( $this->fh, 3 );
                return unpack( 'N', "\x00" . $bytes )[1];

            case 28:
                fseek( $this->fh, $offset );
                $bytes = fread( $this->fh, 7 ); // 3.5 + 3.5 bytes
                if ( $index === 0 ) {
                    // Left: first 3 bytes + high nibble of byte 3
                    $middle = ( ord( $bytes[3] ) >> 4 ) & 0x0F;
                    return ( $middle << 24 ) | ( ord( $bytes[0] ) << 16 ) | ( ord( $bytes[1] ) << 8 ) | ord( $bytes[2] );
                } else {
                    // Right: low nibble of byte 3 + last 3 bytes
                    $middle = ord( $bytes[3] ) & 0x0F;
                    return ( $middle << 24 ) | ( ord( $bytes[4] ) << 16 ) | ( ord( $bytes[5] ) << 8 ) | ord( $bytes[6] );
                }

            case 32:
                fseek( $this->fh, $offset + $index * 4 );
                $bytes = fread( $this->fh, 4 );
                return unpack( 'N', $bytes )[1];

            default:
                throw new \RuntimeException( "Unsupported record size: {$this->record_size}" );
        }
    }

    /**
     * Decode a data section entry.
     *
     * @return array [ mixed $value, int $new_offset ]
     */
    private function decode( int $offset ): array {
        fseek( $this->fh, $offset );
        $ctrl_byte = ord( fread( $this->fh, 1 ) );
        $offset++;

        $type = $ctrl_byte >> 5;

        // Extended type
        if ( $type === 0 ) {
            $ext_byte = ord( fread( $this->fh, 1 ) );
            $offset++;
            $type = $ext_byte + 7;
        }

        // Determine payload size
        $size = $ctrl_byte & 0x1F;
        if ( $type !== 1 ) { // Not pointer
            if ( $size === 29 ) {
                $size = 29 + ord( fread( $this->fh, 1 ) );
                $offset++;
            } elseif ( $size === 30 ) {
                $bytes = fread( $this->fh, 2 );
                $offset += 2;
                $size = 285 + unpack( 'n', $bytes )[1];
            } elseif ( $size === 31 ) {
                $bytes = fread( $this->fh, 3 );
                $offset += 3;
                $size = 65821 + unpack( 'N', "\x00" . $bytes )[1];
            }
        }

        return $this->decode_by_type( $type, $size, $offset );
    }

    /**
     * Decode value by MMDB data type.
     *
     * @return array [ mixed $value, int $new_offset ]
     */
    private function decode_by_type( int $type, int $size, int $offset ): array {
        switch ( $type ) {
            case 1: // Pointer
                return $this->decode_pointer( $size, $offset );

            case 2: // UTF-8 string
                if ( $size === 0 ) return [ '', $offset ];
                fseek( $this->fh, $offset );
                return [ fread( $this->fh, $size ), $offset + $size ];

            case 3: // Double
                fseek( $this->fh, $offset );
                $bytes = fread( $this->fh, 8 );
                return [ unpack( 'E', $bytes )[1], $offset + 8 ];

            case 4: // Bytes
                if ( $size === 0 ) return [ '', $offset ];
                fseek( $this->fh, $offset );
                return [ fread( $this->fh, $size ), $offset + $size ];

            case 5: // Uint16
                return $this->decode_uint( $size, $offset );

            case 6: // Uint32
                return $this->decode_uint( $size, $offset );

            case 7: // Map
                return $this->decode_map( $size, $offset );

            case 8: // Int32
                fseek( $this->fh, $offset );
                $bytes = fread( $this->fh, $size );
                $padded = str_pad( $bytes, 4, "\x00", STR_PAD_LEFT );
                $val = unpack( 'N', $padded )[1];
                // Sign extend
                if ( $val >= 0x80000000 ) $val -= 0x100000000;
                return [ $val, $offset + $size ];

            case 9: // Uint64
                return $this->decode_uint( $size, $offset );

            case 10: // Uint128
                return $this->decode_uint( $size, $offset );

            case 11: // Array
                return $this->decode_array( $size, $offset );

            case 14: // Boolean
                return [ $size !== 0, $offset ];

            case 15: // Float
                fseek( $this->fh, $offset );
                $bytes = fread( $this->fh, 4 );
                return [ unpack( 'G', $bytes )[1], $offset + 4 ];

            default:
                // Skip unknown types
                return [ null, $offset + $size ];
        }
    }

    private function decode_pointer( int $size, int $offset ): array {
        $ptr_size = ( ( $size >> 3 ) & 0x03 );
        $packed   = $size & 0x07;

        switch ( $ptr_size ) {
            case 0:
                fseek( $this->fh, $offset );
                $byte = ord( fread( $this->fh, 1 ) );
                $pointer = ( $packed << 8 ) | $byte;
                $new_offset = $offset + 1;
                break;
            case 1:
                fseek( $this->fh, $offset );
                $bytes = fread( $this->fh, 2 );
                $pointer = 2048 + ( ( $packed << 16 ) | unpack( 'n', $bytes )[1] );
                $new_offset = $offset + 2;
                break;
            case 2:
                fseek( $this->fh, $offset );
                $bytes = fread( $this->fh, 3 );
                $pointer = 526336 + ( ( $packed << 24 ) | unpack( 'N', "\x00" . $bytes )[1] );
                $new_offset = $offset + 3;
                break;
            case 3:
                fseek( $this->fh, $offset );
                $bytes = fread( $this->fh, 4 );
                $pointer = unpack( 'N', $bytes )[1];
                $new_offset = $offset + 4;
                break;
            default:
                throw new \RuntimeException( "Invalid pointer size: $ptr_size" );
        }

        $abs_pointer = $this->data_section_offset + $pointer;
        [ $data ] = $this->decode( $abs_pointer );
        return [ $data, $new_offset ];
    }

    private function decode_uint( int $size, int $offset ): array {
        if ( $size === 0 ) return [ 0, $offset ];
        fseek( $this->fh, $offset );
        $bytes = fread( $this->fh, $size );

        if ( $size <= 4 ) {
            $padded = str_pad( $bytes, 4, "\x00", STR_PAD_LEFT );
            return [ unpack( 'N', $padded )[1], $offset + $size ];
        }

        if ( $size <= 8 ) {
            $padded = str_pad( $bytes, 8, "\x00", STR_PAD_LEFT );
            $parts = unpack( 'N2', $padded );
            $val = ( $parts[1] << 32 ) | $parts[2];
            return [ $val, $offset + $size ];
        }

        // For uint128, return as hex string
        return [ bin2hex( $bytes ), $offset + $size ];
    }

    private function decode_map( int $size, int $offset ): array {
        $map = [];
        for ( $i = 0; $i < $size; $i++ ) {
            [ $key, $offset ]   = $this->decode( $offset );
            [ $value, $offset ] = $this->decode( $offset );
            if ( is_string( $key ) ) {
                $map[ $key ] = $value;
            }
        }
        return [ $map, $offset ];
    }

    private function decode_array( int $size, int $offset ): array {
        $arr = [];
        for ( $i = 0; $i < $size; $i++ ) {
            [ $value, $offset ] = $this->decode( $offset );
            $arr[] = $value;
        }
        return [ $arr, $offset ];
    }

    /**
     * Parse the MMDB metadata section.
     */
    private function parse_metadata(): void {
        // Search for metadata marker from end of file
        $marker     = self::METADATA_MARKER;
        $marker_len = strlen( $marker );

        // Read last 128 KB (metadata is at the end)
        $search_size = min( 131072, $this->file_size );
        fseek( $this->fh, $this->file_size - $search_size );
        $tail = fread( $this->fh, $search_size );

        $pos = strrpos( $tail, $marker );
        if ( $pos === false ) {
            throw new \RuntimeException( 'Invalid MMDB file: metadata marker not found.' );
        }

        $meta_offset = ( $this->file_size - $search_size ) + $pos + $marker_len;

        [ $meta ] = $this->decode( $meta_offset );

        if ( ! is_array( $meta ) || ! isset( $meta['node_count'], $meta['record_size'] ) ) {
            throw new \RuntimeException( 'Invalid MMDB metadata.' );
        }

        $this->node_count  = (int) $meta['node_count'];
        $this->record_size = (int) $meta['record_size'];
        $this->ip_version  = (int) ( $meta['ip_version'] ?? 4 );
        $this->db_type     = (string) ( $meta['database_type'] ?? 'unknown' );
        $this->build_epoch = (int) ( $meta['build_epoch'] ?? 0 );

        $this->node_byte_size      = (int) ( $this->record_size / 4 );  // bytes per node
        $this->tree_size           = $this->node_count * $this->node_byte_size;
        $this->data_section_offset = $this->tree_size + 16; // 16 bytes separator
    }
}