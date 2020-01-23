<?php

namespace App\Http\Controllers;

use App\Repository\TaskRepositoryInterface;

class TaskListController extends Controller
{
    protected $repo;

    public function __construct(TaskRepositoryInterface $repo)
    {
        $this->repo = $repo;
    }

    public function getList()
    {
        $sort = request()->get("sort","DESC");
        $limit = request()->get("limit", 10);

        return [
            "tasks" => $this->repo->getList($sort,$limit)
        ];
    }
}
