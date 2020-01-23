<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\ValueObject\TaskObject;

class Task extends Model
{
    protected $table = "tasks";

    protected $guarded = [];

    public function toValueObject(){
        return new TaskObject(
            $this->title,
            $this->created_at
        );
    }
}
