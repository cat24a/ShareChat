<?php

require_once "dbdata.php";

$request = json_decode(file_get_contents("php://input"));
switch ($request->action) {
    case "get_latest":
        $query = $db->prepare("SELECT `id`, `content` FROM `messages` WHERE `chat`=:chat");
        $query->execute(["chat"=>$request->chat]);
        $messages = $query->fetchAll(PDO::FETCH_ASSOC);
        $response = [
            "messages" => $messages,
        ];
        $response = json_encode($response);
        echo $response;
        break;
	case "send":
		$query = $db->prepare("INSERT INTO `messages`(`chat`, `content`) VALUES (:chat, :content)");
		$query->execute($request);
		break;
}