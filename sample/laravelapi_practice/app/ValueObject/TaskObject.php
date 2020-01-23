<?php

namespace App\ValueObject;

use Carbon\Carbon;

class TaskObject
{
    public $title;

    public $createdAt;

    public function __construct(string $title,Carbon $createdAt)
    {
        $this->title = $title;
        $this->createdAt = $createdAt;
    }
}
