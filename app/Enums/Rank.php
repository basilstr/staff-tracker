<?php

declare(strict_types=1);

namespace App\Enums;

enum Rank : int
{
    case Owner = 60;
    case Admin = 50;
    case Moderator = 40;
    case Self = 30;
    case View = 20;
    case Forbidden = 10;

    public function label(): string
    {
        return self::list()[$this->value];
    }

    public function isLowerThan(self $rank): bool
    {
        return $this->value < $rank->value;
    }
    public function isNotLowerThan(self $rank): bool
    {
        return $this->value >= $rank->value;
    }

    public static function list(): array
    {
        return [
            self::Owner->value => __('Rank Owner'),
            self::Admin->value => __('Rank Admin'),
            self::Moderator->value => __('Rank Moderator'),
            self::Self->value => __('Rank Self'),
            self::View->value => __('Rank View'),
            self::Forbidden->value => __('Rank Forbidden'),
        ];
    }
}
