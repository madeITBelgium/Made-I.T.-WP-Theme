<?php

/**
 * Standalone QR Code SVG Generator.
 *
 * Generates QR codes as scalable SVG strings. Supports Byte mode encoding
 * with error correction level M, versions 1-10. Designed for otpauth:// URIs
 * used in TOTP two-factor authentication.
 *
 * No external dependencies. Pure PHP 8.0+ implementation.
 */

namespace MadeIT\Security\lib;

defined('ABSPATH') || exit;

/**
 * QR Code generator that outputs SVG markup.
 *
 * Usage:
 *   $svg = QRCode::svg('otpauth://totp/Example:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Example');
 *   echo $svg;
 */
class QRCode
{
    // ---------------------------------------------------------------------------
    // Public API
    // ---------------------------------------------------------------------------

    /**
     * Generate a QR code as an SVG string.
     *
     * @param string $data The data to encode (e.g. an otpauth:// URI).
     * @param int    $size The width/height of the SVG element in pixels.
     *
     * @throws \InvalidArgumentException If data is too long for version 10.
     *
     * @return string Complete SVG markup.
     */
    public static function svg(string $data, int $size = 200): string
    {
        // Encode the data payload (Byte mode, EC level M).
        $version = self::selectVersion(strlen($data));
        $codewords = self::encodeData($data, $version);

        // Add error-correction codewords.
        $blocks = self::addErrorCorrection($codewords, $version);

        // Interleave data and EC blocks, then append remainder bits.
        $bits = self::interleave($blocks, $version);

        // Build the module matrix (true = dark).
        $matrix = self::buildMatrix($version, $bits);

        // Render to SVG.
        return self::renderSVG($matrix, $size);
    }

    // ---------------------------------------------------------------------------
    // QR Specification tables
    // ---------------------------------------------------------------------------

    /**
     * Byte-mode capacity at EC level M for versions 1-10.
     * Source: ISO/IEC 18004, Table 7.
     */
    private const BYTE_CAPACITY_M = [
        1  => 14,
        2  => 26,
        3  => 42,
        4  => 62,
        5  => 84,
        6  => 106,
        7  => 122,
        8  => 152,
        9  => 180,
        10 => 213,
    ];

    /**
     * Total data codewords at EC level M for versions 1-10.
     */
    private const TOTAL_DATA_CODEWORDS_M = [
        1  => 16,
        2  => 28,
        3  => 44,
        4  => 64,
        5  => 86,
        6  => 108,
        7  => 124,
        8  => 154,
        9  => 182,
        10 => 216,
    ];

    /**
     * Error correction codewords per block at EC level M.
     */
    private const EC_CODEWORDS_PER_BLOCK_M = [
        1  => 10,
        2  => 16,
        3  => 26,
        4  => 18,
        5  => 24,
        6  => 16,
        7  => 18,
        8  => 22,
        9  => 22,
        10 => 26,
    ];

    /**
     * Block structure at EC level M: [numBlocks1, dataPerBlock1, numBlocks2, dataPerBlock2].
     * numBlocks2/dataPerBlock2 = 0 when there is only one group.
     */
    private const BLOCK_STRUCTURE_M = [
        1  => [1, 16, 0, 0],
        2  => [1, 28, 0, 0],
        3  => [1, 44, 0, 0],
        4  => [2, 32, 0, 0],
        5  => [2, 43, 0, 0],
        6  => [4, 27, 0, 0],
        7  => [4, 31, 0, 0],
        8  => [2, 38, 2, 39],
        9  => [3, 36, 2, 37],
        10 => [4, 43, 1, 44],
    ];

    /**
     * Alignment pattern center coordinates for versions 2-10.
     * Version 1 has no alignment patterns.
     */
    private const ALIGNMENT_POSITIONS = [
        2  => [6, 18],
        3  => [6, 22],
        4  => [6, 26],
        5  => [6, 30],
        6  => [6, 34],
        7  => [6, 22, 38],
        8  => [6, 24, 42],
        9  => [6, 26, 46],
        10 => [6, 28, 50],
    ];

    /**
     * Remainder bits appended after interleaved codewords.
     */
    private const REMAINDER_BITS = [
        1 => 0, 2 => 7, 3 => 7, 4 => 7, 5 => 7,
        6 => 7, 7 => 0, 8 => 0, 9 => 0, 10 => 0,
    ];

    /**
     * Format information strings (15-bit BCH) for EC level M, masks 0-7.
     * Includes the XOR mask 0x5412 already applied.
     */
    private const FORMAT_INFO_M = [
        0 => 0x5412,
        1 => 0x5125,
        2 => 0x5E7C,
        3 => 0x5B4B,
        4 => 0x45F9,
        5 => 0x40CE,
        6 => 0x4F97,
        7 => 0x4AA0,
    ];

    // ---------------------------------------------------------------------------
    // Version selection
    // ---------------------------------------------------------------------------

    /**
     * Select the smallest QR version that can hold the given byte count.
     *
     * @param int $byteCount Number of data bytes.
     *
     * @throws \InvalidArgumentException If data exceeds version 10 capacity.
     *
     * @return int QR version (1-10).
     */
    private static function selectVersion(int $byteCount): int
    {
        foreach (self::BYTE_CAPACITY_M as $v => $cap) {
            if ($byteCount <= $cap) {
                return $v;
            }
        }

        throw new \InvalidArgumentException(
            // phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- exception message is never rendered as HTML
            "Data too long ({$byteCount} bytes) for QR versions 1-10 at EC level M (max 213 bytes)."
        );
    }

    // ---------------------------------------------------------------------------
    // Data encoding (Byte mode)
    // ---------------------------------------------------------------------------

    /**
     * Encode the data string into codewords (Byte mode, EC level M).
     *
     * Bit stream layout:
     *   [mode indicator 4 bits][character count 8 or 16 bits][data bytes][terminator][padding]
     *
     * @param string $data    Raw data string.
     * @param int    $version QR version.
     *
     * @return int[] Array of codeword integers (0-255).
     */
    private static function encodeData(string $data, int $version): array
    {
        $totalDataCodewords = self::TOTAL_DATA_CODEWORDS_M[$version];
        $len = strlen($data);

        // Character count indicator length: 8 bits for versions 1-9, 16 bits for version 10+.
        $cciBits = ($version <= 9) ? 8 : 16;

        // Build the bit stream.
        $bits = '';

        // Mode indicator: 0100 = Byte mode.
        $bits .= '0100';

        // Character count indicator.
        $bits .= str_pad(decbin($len), $cciBits, '0', STR_PAD_LEFT);

        // Data bytes.
        for ($i = 0; $i < $len; $i++) {
            $bits .= str_pad(decbin(ord($data[$i])), 8, '0', STR_PAD_LEFT);
        }

        // Terminator (up to 4 zero bits, but don't exceed total capacity).
        $totalBits = $totalDataCodewords * 8;
        $terminatorLen = min(4, $totalBits - strlen($bits));
        $bits .= str_repeat('0', $terminatorLen);

        // Pad to byte boundary.
        $padToByteLen = (8 - (strlen($bits) % 8)) % 8;
        $bits .= str_repeat('0', $padToByteLen);

        // Pad codewords alternating 0xEC, 0x11 until we reach total capacity.
        $padBytes = ['11101100', '00010001']; // 0xEC, 0x11
        $padIdx = 0;
        while (strlen($bits) < $totalBits) {
            $bits .= $padBytes[$padIdx];
            $padIdx = 1 - $padIdx;
        }

        // Convert bit string to codeword array.
        $codewords = [];
        for ($i = 0; $i < $totalDataCodewords; $i++) {
            $codewords[] = (int) bindec(substr($bits, $i * 8, 8));
        }

        return $codewords;
    }

    // ---------------------------------------------------------------------------
    // Reed-Solomon error correction
    // ---------------------------------------------------------------------------

    /**
     * Add Reed-Solomon EC codewords to the data codewords.
     *
     * @param int[] $codewords Data codewords.
     * @param int   $version   QR version.
     *
     * @return array{ data: int[][], ec: int[][] } Arrays of data blocks and EC blocks.
     */
    private static function addErrorCorrection(array $codewords, int $version): array
    {
        $ecPerBlock = self::EC_CODEWORDS_PER_BLOCK_M[$version];
        [$nb1, $dc1, $nb2, $dc2] = self::BLOCK_STRUCTURE_M[$version];

        $dataBlocks = [];
        $ecBlocks = [];
        $offset = 0;

        // Group 1 blocks.
        for ($i = 0; $i < $nb1; $i++) {
            $block = array_slice($codewords, $offset, $dc1);
            $dataBlocks[] = $block;
            $ecBlocks[] = self::rsEncode($block, $ecPerBlock);
            $offset += $dc1;
        }

        // Group 2 blocks (if any).
        for ($i = 0; $i < $nb2; $i++) {
            $block = array_slice($codewords, $offset, $dc2);
            $dataBlocks[] = $block;
            $ecBlocks[] = self::rsEncode($block, $ecPerBlock);
            $offset += $dc2;
        }

        return ['data' => $dataBlocks, 'ec' => $ecBlocks];
    }

    /**
     * Compute Reed-Solomon error correction codewords for one block.
     *
     * Uses GF(2^8) with primitive polynomial 0x11D (x^8 + x^4 + x^3 + x^2 + 1).
     *
     * @param int[] $data    Data codewords for one block.
     * @param int   $ecCount Number of EC codewords to generate.
     *
     * @return int[] EC codewords.
     */
    private static function rsEncode(array $data, int $ecCount): array
    {
        $gf = self::gfTables();

        // Build generator polynomial.
        $gen = self::rsGeneratorPoly($ecCount, $gf);

        // Initialize message polynomial (data + ecCount zero terms).
        $msg = array_merge($data, array_fill(0, $ecCount, 0));

        // Polynomial long division in GF(2^8).
        for ($i = 0, $dLen = count($data); $i < $dLen; $i++) {
            $coef = $msg[$i];
            if ($coef === 0) {
                continue;
            }
            $logCoef = $gf['log'][$coef];
            for ($j = 0; $j <= $ecCount; $j++) {
                $msg[$i + $j] ^= $gf['exp'][($logCoef + $gf['log'][$gen[$j]]) % 255];
            }
        }

        // The remainder is the EC codewords.
        return array_slice($msg, count($data));
    }

    /**
     * Build the RS generator polynomial for a given number of EC codewords.
     *
     * generator(n) = (x - a^0)(x - a^1)...(x - a^(n-1))
     *
     * @param int   $ecCount Number of EC codewords.
     * @param array $gf      GF(2^8) log/exp tables.
     *
     * @return int[] Polynomial coefficients (highest degree first).
     */
    private static function rsGeneratorPoly(int $ecCount, array $gf): array
    {
        $poly = [1];

        for ($i = 0; $i < $ecCount; $i++) {
            $newPoly = array_fill(0, count($poly) + 1, 0);
            $alphaI = $gf['exp'][$i];

            for ($j = 0, $pLen = count($poly); $j < $pLen; $j++) {
                // Multiply by x.
                $newPoly[$j] ^= $poly[$j];
                // Multiply by -a^i (which is +a^i in GF(2^8) since -1 = 1).
                if ($poly[$j] !== 0) {
                    $newPoly[$j + 1] ^= $gf['exp'][($gf['log'][$poly[$j]] + $i) % 255];
                } else {
                    // $newPoly[ $j + 1 ] ^= 0 is a no-op.
                }
            }

            $poly = $newPoly;
        }

        return $poly;
    }

    /**
     * Build GF(2^8) log and exp tables.
     *
     * @return array{ log: int[], exp: int[] }
     */
    private static function gfTables(): array
    {
        static $tables = null;
        if ($tables !== null) {
            return $tables;
        }

        $exp = array_fill(0, 512, 0);
        $log = array_fill(0, 256, 0);

        $x = 1;
        for ($i = 0; $i < 255; $i++) {
            $exp[$i] = $x;
            $log[$x] = $i;
            $x <<= 1;
            if ($x >= 256) {
                $x ^= 0x11D; // Primitive polynomial.
            }
        }
        // Extend exp table to avoid modulo in some operations.
        for ($i = 255; $i < 512; $i++) {
            $exp[$i] = $exp[$i - 255];
        }

        $tables = ['log' => $log, 'exp' => $exp];

        return $tables;
    }

    // ---------------------------------------------------------------------------
    // Interleaving
    // ---------------------------------------------------------------------------

    /**
     * Interleave data and EC blocks, then append remainder bits.
     *
     * @param array $blocks  From addErrorCorrection().
     * @param int   $version QR version.
     *
     * @return string Bit string of all codewords + remainder.
     */
    private static function interleave(array $blocks, int $version): string
    {
        $dataBlocks = $blocks['data'];
        $ecBlocks = $blocks['ec'];

        // Interleave data codewords.
        $interleaved = [];
        $maxDataLen = max(array_map('count', $dataBlocks));
        for ($i = 0; $i < $maxDataLen; $i++) {
            foreach ($dataBlocks as $block) {
                if (isset($block[$i])) {
                    $interleaved[] = $block[$i];
                }
            }
        }

        // Interleave EC codewords.
        $maxEcLen = max(array_map('count', $ecBlocks));
        for ($i = 0; $i < $maxEcLen; $i++) {
            foreach ($ecBlocks as $block) {
                if (isset($block[$i])) {
                    $interleaved[] = $block[$i];
                }
            }
        }

        // Convert to bit string.
        $bits = '';
        foreach ($interleaved as $cw) {
            $bits .= str_pad(decbin($cw), 8, '0', STR_PAD_LEFT);
        }

        // Append remainder bits.
        $bits .= str_repeat('0', self::REMAINDER_BITS[$version]);

        return $bits;
    }

    // ---------------------------------------------------------------------------
    // Matrix construction
    // ---------------------------------------------------------------------------

    /**
     * Build the QR code module matrix.
     *
     * @param int    $version QR version.
     * @param string $bits    Encoded + interleaved bit string.
     *
     * @return bool[][] 2D array of booleans (true = dark module).
     */
    private static function buildMatrix(int $version, string $bits): array
    {
        $size = 17 + $version * 4;

        // Initialize matrix and reservation mask.
        // matrix: null = unset, true = dark, false = light.
        $matrix = array_fill(0, $size, array_fill(0, $size, null));
        $reserved = array_fill(0, $size, array_fill(0, $size, false));

        // Place finder patterns (top-left, top-right, bottom-left).
        self::placeFinderPattern($matrix, $reserved, 0, 0);
        self::placeFinderPattern($matrix, $reserved, 0, $size - 7);
        self::placeFinderPattern($matrix, $reserved, $size - 7, 0);

        // Place separators around finder patterns.
        self::placeSeparators($matrix, $reserved, $size);

        // Place alignment patterns.
        if ($version >= 2) {
            self::placeAlignmentPatterns($matrix, $reserved, $version);
        }

        // Place timing patterns.
        self::placeTimingPatterns($matrix, $reserved, $size);

        // Place dark module.
        $matrix[4 * $version + 9][8] = true;
        $reserved[4 * $version + 9][8] = true;

        // Reserve format information areas (don't fill yet).
        self::reserveFormatAreas($reserved, $size);

        // Place data bits using the upward/downward serpentine pattern.
        self::placeDataBits($matrix, $reserved, $size, $bits);

        // Select optimal mask pattern.
        $bestMask = self::selectBestMask($matrix, $reserved, $size);

        // Apply the chosen mask and format information.
        self::applyMask($matrix, $reserved, $size, $bestMask);
        self::placeFormatInfo($matrix, $size, $bestMask);

        // Convert null to false (shouldn't exist, but safety).
        for ($r = 0; $r < $size; $r++) {
            for ($c = 0; $c < $size; $c++) {
                if ($matrix[$r][$c] === null) {
                    $matrix[$r][$c] = false;
                }
            }
        }

        return $matrix;
    }

    /**
     * Place a 7x7 finder pattern with top-left corner at (row, col).
     */
    private static function placeFinderPattern(array &$matrix, array &$reserved, int $row, int $col): void
    {
        $pattern = [
            [1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1],
        ];
        for ($r = 0; $r < 7; $r++) {
            for ($c = 0; $c < 7; $c++) {
                $matrix[$row + $r][$col + $c] = (bool) $pattern[$r][$c];
                $reserved[$row + $r][$col + $c] = true;
            }
        }
    }

    /**
     * Place separator rows/columns (all light) around the three finder patterns.
     */
    private static function placeSeparators(array &$matrix, array &$reserved, int $size): void
    {
        // Top-left finder: right column (col 7) and bottom row (row 7).
        for ($i = 0; $i < 8; $i++) {
            // Right of top-left.
            $matrix[$i][7] = false;
            $reserved[$i][7] = true;
            // Below top-left.
            $matrix[7][$i] = false;
            $reserved[7][$i] = true;

            // Left of top-right.
            $matrix[$i][$size - 8] = false;
            $reserved[$i][$size - 8] = true;
            // Below top-right.
            $matrix[7][$size - 8 + $i] = false;
            $reserved[7][$size - 8 + $i] = true;

            // Right of bottom-left.
            $matrix[$size - 8 + $i][7] = false;
            $reserved[$size - 8 + $i][7] = true;
            // Above bottom-left.
            $matrix[$size - 8][$i] = false;
            $reserved[$size - 8][$i] = true;
        }
    }

    /**
     * Place 5x5 alignment patterns.
     */
    private static function placeAlignmentPatterns(array &$matrix, array &$reserved, int $version): void
    {
        $positions = self::ALIGNMENT_POSITIONS[$version];
        $count = count($positions);

        for ($i = 0; $i < $count; $i++) {
            for ($j = 0; $j < $count; $j++) {
                $cr = $positions[$i];
                $cc = $positions[$j];

                // Skip if overlapping a finder pattern.
                if ($reserved[$cr][$cc]) {
                    continue;
                }

                // Place 5x5 alignment pattern centered at (cr, cc).
                for ($r = -2; $r <= 2; $r++) {
                    for ($c = -2; $c <= 2; $c++) {
                        $dark = (abs($r) === 2 || abs($c) === 2 || ($r === 0 && $c === 0));
                        $matrix[$cr + $r][$cc + $c] = $dark;
                        $reserved[$cr + $r][$cc + $c] = true;
                    }
                }
            }
        }
    }

    /**
     * Place timing patterns (horizontal row 6, vertical column 6).
     */
    private static function placeTimingPatterns(array &$matrix, array &$reserved, int $size): void
    {
        for ($i = 8; $i < $size - 8; $i++) {
            $dark = ($i % 2 === 0);
            // Horizontal (row 6).
            if (!$reserved[6][$i]) {
                $matrix[6][$i] = $dark;
                $reserved[6][$i] = true;
            }
            // Vertical (column 6).
            if (!$reserved[$i][6]) {
                $matrix[$i][6] = $dark;
                $reserved[$i][6] = true;
            }
        }
    }

    /**
     * Reserve the areas where format information will be placed.
     * (Two copies: around top-left finder and split between top-right/bottom-left.).
     */
    private static function reserveFormatAreas(array &$reserved, int $size): void
    {
        // Around top-left finder.
        for ($i = 0; $i <= 8; $i++) {
            $reserved[8][$i] = true; // Horizontal.
            $reserved[$i][8] = true; // Vertical.
        }
        // Top-right.
        for ($i = $size - 8; $i < $size; $i++) {
            $reserved[8][$i] = true;
        }
        // Bottom-left.
        for ($i = $size - 7; $i < $size; $i++) {
            $reserved[$i][8] = true;
        }
    }

    /**
     * Place data bits in the serpentine pattern (right-to-left columns, upward/downward).
     */
    private static function placeDataBits(array &$matrix, array &$reserved, int $size, string $bits): void
    {
        $bitIdx = 0;
        $bitLen = strlen($bits);

        // Columns are traversed in pairs from right to left.
        // Column 6 is skipped (timing pattern).
        $col = $size - 1;
        while ($col >= 0) {
            if ($col === 6) {
                $col--;
                continue;
            }

            // Determine direction: upward for the first pair, then alternating.
            // The column pair index determines direction.
            $colPairIdx = ($col >= 7) ? ($size - 1 - $col) / 2 : ($size - 2 - $col) / 2;
            $goingUp = ((int) $colPairIdx % 2 === 0);

            if ($goingUp) {
                for ($row = $size - 1; $row >= 0; $row--) {
                    for ($dc = 0; $dc >= -1; $dc--) {
                        $c = $col + $dc;
                        if ($c < 0) {
                            continue;
                        }
                        if ($reserved[$row][$c]) {
                            continue;
                        }
                        if ($bitIdx < $bitLen) {
                            $matrix[$row][$c] = ($bits[$bitIdx] === '1');
                            $bitIdx++;
                        } else {
                            $matrix[$row][$c] = false;
                        }
                    }
                }
            } else {
                for ($row = 0; $row < $size; $row++) {
                    for ($dc = 0; $dc >= -1; $dc--) {
                        $c = $col + $dc;
                        if ($c < 0) {
                            continue;
                        }
                        if ($reserved[$row][$c]) {
                            continue;
                        }
                        if ($bitIdx < $bitLen) {
                            $matrix[$row][$c] = ($bits[$bitIdx] === '1');
                            $bitIdx++;
                        } else {
                            $matrix[$row][$c] = false;
                        }
                    }
                }
            }

            $col -= 2;
        }
    }

    // ---------------------------------------------------------------------------
    // Masking
    // ---------------------------------------------------------------------------

    /**
     * Evaluate a mask pattern condition.
     *
     * @param int $mask Mask pattern number (0-7).
     * @param int $row  Module row.
     * @param int $col  Module column.
     *
     * @return bool True if the module should be flipped.
     */
    private static function maskCondition(int $mask, int $row, int $col): bool
    {
        return match ($mask) {
            0       => (($row + $col) % 2 === 0),
            1       => ($row % 2 === 0),
            2       => ($col % 3 === 0),
            3       => (($row + $col) % 3 === 0),
            4       => ((intdiv($row, 2) + intdiv($col, 3)) % 2 === 0),
            5       => (($row * $col) % 2 + ($row * $col) % 3 === 0),
            6       => ((($row * $col) % 2 + ($row * $col) % 3) % 2 === 0),
            7       => ((($row + $col) % 2 + ($row * $col) % 3) % 2 === 0),
            default => false,
        };
    }

    /**
     * Select the mask pattern with the lowest penalty score.
     */
    private static function selectBestMask(array $matrix, array $reserved, int $size): int
    {
        $bestMask = 0;
        $bestPenalty = PHP_INT_MAX;

        for ($mask = 0; $mask < 8; $mask++) {
            // Create a test matrix with this mask applied.
            $test = $matrix;
            self::applyMask($test, $reserved, $size, $mask);
            self::placeFormatInfo($test, $size, $mask);

            $penalty = self::evaluatePenalty($test, $size);
            if ($penalty < $bestPenalty) {
                $bestPenalty = $penalty;
                $bestMask = $mask;
            }
        }

        return $bestMask;
    }

    /**
     * Apply a mask pattern to the data modules (non-reserved areas).
     */
    private static function applyMask(array &$matrix, array $reserved, int $size, int $mask): void
    {
        for ($r = 0; $r < $size; $r++) {
            for ($c = 0; $c < $size; $c++) {
                if ($reserved[$r][$c]) {
                    continue;
                }
                if (self::maskCondition($mask, $r, $c)) {
                    $matrix[$r][$c] = !$matrix[$r][$c];
                }
            }
        }
    }

    /**
     * Place format information bits around the finder patterns.
     *
     * @param array $matrix Module matrix.
     * @param int   $size   Matrix dimension.
     * @param int   $mask   Mask pattern index (0-7).
     */
    private static function placeFormatInfo(array &$matrix, int $size, int $mask): void
    {
        $formatBits = self::FORMAT_INFO_M[$mask];

        // Extract 15 bits (MSB first, bit 14 = leftmost).
        $bits = [];
        for ($i = 14; $i >= 0; $i--) {
            $bits[] = (bool) (($formatBits >> $i) & 1);
        }

        // Place around top-left finder.
        // Horizontal strip (row 8, columns 0-7 skipping column 6 for timing).
        $hPositions = [
            [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5],
            [8, 7], // skip col 6 (timing)
            [8, 8],
        ];
        // Vertical strip (column 8, rows 8,7,5,4,3,2,1,0 — skip row 6 for timing).
        // Continuing from bit 8 to bit 14.
        $vPositions = [
            [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
        ];

        // First 8 bits go to horizontal strip.
        for ($i = 0; $i < 8; $i++) {
            $matrix[$hPositions[$i][0]][$hPositions[$i][1]] = $bits[$i];
        }
        // Next 7 bits go to vertical strip.
        for ($i = 0; $i < 7; $i++) {
            $matrix[$vPositions[$i][0]][$vPositions[$i][1]] = $bits[8 + $i];
        }

        // Second copy: top-right (horizontal) and bottom-left (vertical).
        // Top-right: row 8, columns (size-1) to (size-8), bits 0-7.
        for ($i = 0; $i < 8; $i++) {
            $matrix[8][$size - 1 - $i] = $bits[$i];
        }
        // Bottom-left: column 8, rows (size-7) to (size-1), bits 8-14.
        for ($i = 0; $i < 7; $i++) {
            $matrix[$size - 7 + $i][8] = $bits[8 + $i];
        }
    }

    // ---------------------------------------------------------------------------
    // Penalty evaluation (ISO 18004 Section 7.8.3)
    // ---------------------------------------------------------------------------

    /**
     * Evaluate the total penalty score of a matrix.
     *
     * Implements all four penalty rules.
     */
    private static function evaluatePenalty(array $matrix, int $size): int
    {
        $penalty = 0;

        // Rule 1: Runs of same-color modules (>=5 consecutive).
        $penalty += self::penaltyRule1($matrix, $size);

        // Rule 2: 2x2 blocks of same-color modules.
        $penalty += self::penaltyRule2($matrix, $size);

        // Rule 3: Finder-like patterns (1:1:3:1:1 with 4 light modules).
        $penalty += self::penaltyRule3($matrix, $size);

        // Rule 4: Proportion of dark modules.
        $penalty += self::penaltyRule4($matrix, $size);

        return $penalty;
    }

    /**
     * Penalty Rule 1: Adjacent modules in row/column that are same color.
     * N1 (3) + (run length - 5) for each run of 5+.
     */
    private static function penaltyRule1(array $matrix, int $size): int
    {
        $penalty = 0;

        for ($r = 0; $r < $size; $r++) {
            // Horizontal.
            $run = 1;
            $prev = $matrix[$r][0];
            for ($c = 1; $c < $size; $c++) {
                if ($matrix[$r][$c] === $prev) {
                    $run++;
                } else {
                    if ($run >= 5) {
                        $penalty += 3 + ($run - 5);
                    }
                    $run = 1;
                    $prev = $matrix[$r][$c];
                }
            }
            if ($run >= 5) {
                $penalty += 3 + ($run - 5);
            }

            // Vertical.
            $run = 1;
            $prev = $matrix[0][$r];
            for ($c = 1; $c < $size; $c++) {
                if ($matrix[$c][$r] === $prev) {
                    $run++;
                } else {
                    if ($run >= 5) {
                        $penalty += 3 + ($run - 5);
                    }
                    $run = 1;
                    $prev = $matrix[$c][$r];
                }
            }
            if ($run >= 5) {
                $penalty += 3 + ($run - 5);
            }
        }

        return $penalty;
    }

    /**
     * Penalty Rule 2: 2x2 blocks of same color. 3 points each.
     */
    private static function penaltyRule2(array $matrix, int $size): int
    {
        $penalty = 0;
        for ($r = 0; $r < $size - 1; $r++) {
            for ($c = 0; $c < $size - 1; $c++) {
                $v = $matrix[$r][$c];
                if (
                    $v === $matrix[$r][$c + 1] &&
                    $v === $matrix[$r + 1][$c] &&
                    $v === $matrix[$r + 1][$c + 1]
                ) {
                    $penalty += 3;
                }
            }
        }

        return $penalty;
    }

    /**
     * Penalty Rule 3: Finder-like patterns. 40 points each.
     * Pattern: dark-light-dark-dark-dark-light-dark followed/preceded by 4 light modules.
     */
    private static function penaltyRule3(array $matrix, int $size): int
    {
        $penalty = 0;
        $p1 = [true, false, true, true, true, false, true, false, false, false, false];
        $p2 = [false, false, false, false, true, false, true, true, true, false, true];

        for ($r = 0; $r < $size; $r++) {
            for ($c = 0; $c <= $size - 11; $c++) {
                // Horizontal.
                $match1 = true;
                $match2 = true;
                for ($k = 0; $k < 11; $k++) {
                    if ($matrix[$r][$c + $k] !== $p1[$k]) {
                        $match1 = false;
                    }
                    if ($matrix[$r][$c + $k] !== $p2[$k]) {
                        $match2 = false;
                    }
                    if (!$match1 && !$match2) {
                        break;
                    }
                }
                if ($match1 || $match2) {
                    $penalty += 40;
                }

                // Vertical.
                $match1 = true;
                $match2 = true;
                for ($k = 0; $k < 11; $k++) {
                    if ($matrix[$c + $k][$r] !== $p1[$k]) {
                        $match1 = false;
                    }
                    if ($matrix[$c + $k][$r] !== $p2[$k]) {
                        $match2 = false;
                    }
                    if (!$match1 && !$match2) {
                        break;
                    }
                }
                if ($match1 || $match2) {
                    $penalty += 40;
                }
            }
        }

        return $penalty;
    }

    /**
     * Penalty Rule 4: Dark module proportion deviation from 50%.
     * 10 points for each 5% deviation.
     */
    private static function penaltyRule4(array $matrix, int $size): int
    {
        $darkCount = 0;
        for ($r = 0; $r < $size; $r++) {
            for ($c = 0; $c < $size; $c++) {
                if ($matrix[$r][$c]) {
                    $darkCount++;
                }
            }
        }

        $total = $size * $size;
        $percent = ($darkCount * 100) / $total;

        $prevFive = (int) (floor($percent / 5) * 5);
        $nextFive = $prevFive + 5;

        $penalty = min(
            abs($prevFive - 50) / 5,
            abs($nextFive - 50) / 5
        );

        return (int) ($penalty * 10);
    }

    // ---------------------------------------------------------------------------
    // SVG rendering
    // ---------------------------------------------------------------------------

    /**
     * Render a module matrix as an SVG string.
     *
     * @param bool[][] $matrix Module matrix (true = dark).
     * @param int      $size   SVG width and height in pixels.
     *
     * @return string Complete SVG markup.
     */
    private static function renderSVG(array $matrix, int $size): string
    {
        $modules = count($matrix);
        $quietZone = 4;
        $total = $modules + $quietZone * 2; // Total modules including quiet zone.

        $svg = '<svg xmlns="http://www.w3.org/2000/svg"';
        $svg .= ' width="'.$size.'" height="'.$size.'"';
        $svg .= ' viewBox="0 0 '.$total.' '.$total.'"';
        $svg .= ' shape-rendering="crispEdges">';

        // White background (covers quiet zone).
        $svg .= '<rect width="'.$total.'" height="'.$total.'" fill="#ffffff"/>';

        // Build a single path for all dark modules (much smaller than individual rects).
        $path = '';
        for ($r = 0; $r < $modules; $r++) {
            for ($c = 0; $c < $modules; $c++) {
                if ($matrix[$r][$c]) {
                    $x = $c + $quietZone;
                    $y = $r + $quietZone;
                    $path .= 'M'.$x.','.$y.'h1v1h-1z';
                }
            }
        }

        if ($path !== '') {
            $svg .= '<path d="'.$path.'" fill="#000000"/>';
        }

        $svg .= '</svg>';

        return $svg;
    }
}
