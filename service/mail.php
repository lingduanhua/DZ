<?php
//引入发送邮件类
function send_mail($tomail,$token){
	require("swiftmailer/lib/swift_required.php"); 
	$username = '15617198028@163.com';
	$password = 'harrry811913';
	$smtp = 'smtp.163.com'
	$port = 25;
	$url = "http://".$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF']."?do=active&token=$token";
	$urlencode = urlencode($url);


	$transport = Swift_SmtpTransport::newInstance($smtp, $port);
	$transport->setUsername($username);
	$transport->setPassword($password);
	$mailer = Swift_Mailer::newInstance($transport);
	$message = Swift_Message::newInstance();
	$message->setSubject("DZ注册成功");
	$message->setFrom(array($username =>'DZ'));
	$message->setTo(array($tomail));
	$str = "DZ激活账号";
	$str = <<<EOT
	<p>请确认您的邮箱，只差一步，您的注册就成功了！(请在24小时内完成)</p>
	<p>可点击下面的链接以完成注册或复制下面的链接到浏览器地址栏中完成注册：</p>
	<a href="$urlencode"></a>
EOT;
	$message->setBody("{$str}",'text/html','utf-8');
	try{
		if($mailer->send($message)){
			echo "ok";
		}else{
			echo "error";
		} 
	}catch(Swift_ConnectionException $e){
		echo $e->getMessage();
	}
}
//send_mail("1009291860@qq.com");
?>