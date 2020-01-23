<?php

use Illuminate\Database\Seeder;
use App\Task;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {

        factory(Task::class)->create([
            "title" => "牛乳を買う"
        ]);
        factory(Task::class)->create([
            "title" => "本を読む"
        ]);
        factory(Task::class)->create([
            "title" => "部屋の掃除をする"
        ]);
        factory(Task::class)->create([
            "title" => "映画のチケットを取得する"
        ]);
        // $this->call(UsersTableSeeder::class);
    }
}
