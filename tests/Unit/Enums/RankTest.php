<?php
use App\Enums\Rank;

covers(Rank::class);

describe('Rank', function () {

    it('has correct values for each enum case', function () {
        expect(Rank::Owner->value)->toBe(60);
        expect(Rank::Admin->value)->toBe(50);
        expect(Rank::Moderator->value)->toBe(40);
        expect(Rank::Self->value)->toBe(30);
        expect(Rank::View->value)->toBe(20);
        expect(Rank::Forbidden->value)->toBe(10);
    });

    it('returns the correct label for each enum case', function () {
        expect(Rank::Owner->label())->toBe(__('Rank Owner'));
        expect(Rank::Admin->label())->toBe(__('Rank Admin'));
        expect(Rank::Moderator->label())->toBe(__('Rank Moderator'));
        expect(Rank::Self->label())->toBe(__('Rank Self'));
        expect(Rank::View->label())->toBe(__('Rank View'));
        expect(Rank::Forbidden->label())->toBe(__('Rank Forbidden'));
    });

    it('returns the correct list of all enum cases with labels', function () {
        $expected = [
            60 => __('Rank Owner'),
            50 => __('Rank Admin'),
            40 => __('Rank Moderator'),
            30 => __('Rank Self'),
            20 => __('Rank View'),
            10 => __('Rank Forbidden'),
        ];

        expect(Rank::list())->toBe($expected);
    });

    it('correctly compares ranks with isNotLowerThan', function () {
        expect(Rank::Owner->isNotLowerThan(Rank::Admin))->toBeTrue()
            ->and(Rank::Admin->isNotLowerThan(Rank::Moderator))->toBeTrue()
            ->and(Rank::Moderator->isNotLowerThan(Rank::Self))->toBeTrue()
            ->and(Rank::Self->isNotLowerThan(Rank::View))->toBeTrue()
            ->and(Rank::View->isNotLowerThan(Rank::Forbidden))->toBeTrue()
            ->and(Rank::Self->isNotLowerThan(Rank::Owner))->toBeFalse()
            ->and(Rank::View->isNotLowerThan(Rank::Admin))->toBeFalse();

    });

    it('correctly compares ranks with isLowerThan', function () {
        expect(Rank::Admin->isLowerThan(Rank::Owner))->toBeTrue()
            ->and(Rank::Moderator->isLowerThan(Rank::Admin))->toBeTrue()
            ->and(Rank::Self->isLowerThan(Rank::Moderator))->toBeTrue()
            ->and(Rank::View->isLowerThan(Rank::Self))->toBeTrue()
            ->and(Rank::Forbidden->isLowerThan(Rank::View))->toBeTrue()
            ->and(Rank::Owner->isLowerThan(Rank::Self))->toBeFalse()
            ->and(Rank::Admin->isLowerThan(Rank::View))->toBeFalse();

    });
});
