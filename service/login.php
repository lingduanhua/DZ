<?php

$is_post = $_SERVER['REQUEST_METHOD'] == 'POST';
$action = isset($_REQUEST['action']) ? $_REQUEST['action'] : 'login';
if ( !in_array( $action, array( 'logout', 'lostpassword', 'resetpassword', 'register', 'login' ), true ) )
	$action = 'login';

?>
    

<div class="form-item">
	<label class="form-label">用户名</label>
	<input class="login-input form-input" type="text" name="account" />
</div>
<div class="form-item">
	<label class="form-label">密码</label>
	<input class="login-input form-input" type="password" name="password" />
</div>
<?php
switch ($action) {
case 'login':
	if( is_login() ){
		header('index.php'); 
	}
	if( $is_post ){

	}
?>
		<div class="form-button-bar">
			<button id="login-button">登录</button>
			<a href="register.php" id="register-button">注册</a>
		</div>
<?php
break;
case 'register':
?>
		<div class="form-item">
			<label class="form-label">确认密码</label>
			<input class="login-input form-input" type="password" name="re-password" />
		</div>
		<div class="form-item">
			<label class="form-label">邮箱</label>
			<input class="login-input form-input" type="text" name="email" />
		</div>
		<div class="form-button-bar">
			<button id="login-button">取消</button>
			<a href="register.php" id="register-button">确认</a>
		</div>
<?php
				break;
		}
?>
		
	</div>
</body>
</html>

<?php
	}else{
		
		if ( !in_array( $action, array( 'logout', 'lostpassword', 'resetpassword', 'register', 'login' ), true ) )
			$action = 'login';
	}


