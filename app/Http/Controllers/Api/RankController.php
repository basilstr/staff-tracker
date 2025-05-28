<?php
declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Enums\Rank;
use App\Http\Controllers\Controller;


class RankController extends Controller
{
    public function index(): \Illuminate\Http\JsonResponse
    {
        $data = [];
        foreach (Rank::list() as $key => $index) {
            $data[] = ['id' => $key, 'name' => $index];
        }
        return response()->json($data);
    }
}
