<?php

use Illuminate\Database\Eloquent\Builder;

if (! function_exists('ll')) {
    function ll(...$arrs): void
    {
        $fileName = base_path() . '/res.log';

        foreach ($arrs as $arr) {
            if ($arr === false) {
                file_put_contents($fileName, "false\n", FILE_APPEND);
            } elseif ($arr === true) {
                file_put_contents($fileName, "true\n", FILE_APPEND);
            } elseif ($arr === 0) {
                file_put_contents($fileName, "0\n", FILE_APPEND);
            } elseif (!empty($arr)) {
                file_put_contents($fileName, print_r($arr, true) . "\n", FILE_APPEND);
            } else {
                file_put_contents($fileName, "Пусто\n", FILE_APPEND);
            }
        }
    }
}

if (! function_exists('ll_sql')) {
    function ll_sql(Builder $query)
    {
        $sql = $query->toSql();
        $bindings = $query->getBindings();

        // Виконуємо підстановку змінних в SQL-запиті
        $formattedSql = vsprintf(str_replace('?', '%s', $sql), $bindings);
        ll($formattedSql);
    }
}
