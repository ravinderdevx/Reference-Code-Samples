<?php

use yii\helpers\Html;
?>

<style>
.navbar, .footer, .yii-debug-toolbar_position_bottom{display:none !important;}
.wrap > .container {
    padding: 0;
}
.success-page{
    max-width:300px;
    display:block;
    margin: 0 auto;
    text-align: center;
    position: relative;
    top: 50%;
    transform: perspective(1px) translateY(50%)
}

.text-success i {
    font-size: 40px;
}

</style>
<div class="success-page">
    <h4 class="text-success"><i class="glyphicon glyphicon-ok-circle"></i><h4>
    <h2 class="text-success">Payment Successful !</h2>
        <a href="javascript:void(0)" id="success-btn" class="btn btn-success">View Tasks</a>
    </div>
</div>

<script>
	document.getElementById('success-btn').addEventListener('click', handleButtonClick, false);
	function handleButtonClick(e) {
	  window.parent.postMessage({
		payment_success: true
	  }, '*');
	}
</script>
