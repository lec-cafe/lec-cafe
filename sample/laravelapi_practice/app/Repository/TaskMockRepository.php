<?php
namespace App\Repository;

use App\ValueObject\TaskObject;
use Carbon\Carbon;

class TaskMockRepository implements TaskRepositoryInterface
{
    public function getList($sort,$limit)
    {
        return [
            new TaskObject("嘘の予定1",Carbon::now()),
            new TaskObject("嘘の予定2",Carbon::now()),
            new TaskObject("嘘の予定3",Carbon::now()),
            new TaskObject("嘘の予定4",Carbon::now()),
            new TaskObject("嘘の予定5",Carbon::now()),
        ];
    }
}
