<?php

/**
 * Represents a list of DOM nodes.
 *
 * @property-read int $length The list items count
 */
class HTML5DOMNodeList extends \ArrayObject
{
    /**
     * Returns the item at the specified index.
     *
     * @param int $index The item index.
     *
     * @return HTML5DOMElement|null The item at the specified index or null if not existent.
     */
    public function item(int $index)
    {
        return $this->offsetExists($index) ? $this->offsetGet($index) : null;
    }

    /**
     * Returns the value for the property specified.
     *
     * @param string $name The name of the property.
     *
     * @throws \Exception
     *
     * @return mixed
     */
    public function __get(string $name)
    {
        if ($name === 'length') {
            return sizeof($this);
        }

        throw new \Exception('Undefined property: HTML5DOMNodeList::$'.$name);
    }
}
