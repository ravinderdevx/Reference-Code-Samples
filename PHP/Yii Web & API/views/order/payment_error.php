<?php

use yii\helpers\Html;
?>

<style>
.navbar, .footer, .yii-debug-toolbar_position_bottom{display:none !important;}
.wrap > .container {
    padding: 0;
}
.error-page{
    max-width:300px;
    display:block;
    margin: 0 auto;
    text-align: center;
    position: relative;
    top: 50%;
    transform: perspective(1px) translateY(50%)
}

.text-danger i {
    font-size: 40px;
}
    
</style>

<div class="error-page">
    <h4 class="text-danger"><i class="glyphicon glyphicon-remove-cicle"></i><h4>
    <h2 class="text-danger">Payment Failure !! Click below button to try again</h2>
        <a href="javascript:void(0)" id="error-btn" class="btn btn-danger">Re-Process</a>
    </div>
</div>

<script>
	document.getElementById('error-btn').addEventListener('click', handleButtonClick, false);
	function handleButtonClick(e) {
	  window.parent.postMessage({
		payment_success: false
	  }, '*');
	}
</script>
