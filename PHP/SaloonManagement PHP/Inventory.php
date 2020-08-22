<?
	include_once('Connection.php');
	
	cFieldEdit::Javascript();
	cInlineEdit::Javascript();

?>
<script type="text/javascript" src="tinymce/tinymce.min.js"></script>
<script>

function SelectProductsInInventory()
{
	document.getElementById("WaitingForResultsGif").innerHTML = "<img src='images/load.gif' width=25 height=25>";
	var SearchInProduct = document.getElementById("SearchInProduct").value;
	var SelectProductsInInventory = new XMLHttpRequest();
	SelectProductsInInventory.onreadystatechange = function() 
	{
		if (SelectProductsInInventory.readyState == 4 && SelectProductsInInventory.status == 200) 
		{
			document.getElementById("InventoryOutput").innerHTML = SelectProductsInInventory.responseText;
			document.getElementById("WaitingForResultsGif").innerHTML = "";
		}
	};

	SelectProductsInInventory.open("GET", "MiscUpdates.php?Action=SelectProductsInInventory&SearchInProduct=" + SearchInProduct , true);
	SelectProductsInInventory.send();
	return false;
}

function AddNewProduct()
{
	$("#AddProductModal").modal();
}

function AddNewProductComplete()
{
	var UPC = document.getElementById("UPC").value;
	var Name = document.getElementById("Name").value;
	var Description = tinymce.get("Description").getContent();
	var ProductCategory = document.getElementById("ProductCategory").value;
	var Price = document.getElementById("Price").value;
	var Cost = document.getElementById("Cost").value;
	var CommissionPercent = document.getElementById("CommissionPercent").value;
	
	if (Name == "")
	{
		alert ("Name cannot be empty.");
		return false;
	}
	
	if (Price == "")
	{
		alert ("Price cannot be empty.");
		return false;
	}
	
	if (Cost == "")
	{
		alert ("Cost cannot be empty. If cost is unknown, enter 0.");
		return false;
	}
	
	if (CommissionPercent == "")
	{
		alert ("Commission cannot be empty. If commmission is unknown, enter 0.");
		return false;
	}
	
	var AddNewProductComplete = new XMLHttpRequest();
	AddNewProductComplete.onreadystatechange = function() 
	{
		if (AddNewProductComplete.readyState == 4 && AddNewProductComplete.status == 200) 
		{
			Response = JSON.parse(AddNewProductComplete.responseText);
			if (Response['Status'] != "OK")
			{
				alert (Response['Error']);
			}
			else
			{
				document.getElementById("SearchInProduct").value = UPC;
				SelectProductsInInventory();
				$("#AddProductModal").modal("hide");
			}
		}
	};

	AddNewProductComplete.open("GET", "MiscUpdates.php?Action=AddNewProductToStock&UPC=" + UPC + "&Name=" + encodeURIComponent(Name) + "&Description=" + encodeURIComponent(Description) + "&ProductCategory=" + ProductCategory + "&Price=" + Price + "&Cost=" + Cost + "&CommissionPercent=" + CommissionPercent , true);
	AddNewProductComplete.send();
}


function InventoryImageType(e)
{
	var ImageType = $(e).val();
	if(ImageType && ImageType=="LocalImage")
	{
		$(e).closest(".labelsection").siblings(".ExternalLinkSection").hide();
		$(e).closest(".labelsection").siblings(".LocalImageSection").show();
	}
	else if(ImageType && ImageType=="ExternalLink")
	{
		$(e).closest(".labelsection").siblings(".LocalImageSection").hide();
		$(e).closest(".labelsection").siblings(".ExternalLinkSection").show();
	}
}

tinymce.init({
	selector: ".Description",
	height: 250,
	toolbar: "undo redo | fontselect | underline | strikethrough | fontsizeselect | styleselect | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",    
	plugins: "textcolor",
	menubar: "tools table format edit",
	font_formats: "Andale Mono=andale mono,times;"+
	"Arial=arial,helvetica,sans-serif;"+
	"Arial Black=arial black,avant garde;"+
	"Book Antiqua=book antiqua,palatino;"+
	"Comic Sans MS=comic sans ms,sans-serif;"+
	"Courier New=courier new,courier;"+
	"Georgia=georgia,palatino;"+
	"Helvetica=helvetica;"+
	"Impact=impact,chicago;"+
	"Symbol=symbol;"+
	"Tahoma=tahoma,arial,helvetica,sans-serif;"+
	"Terminal=terminal,monaco;"+
	"Times New Roman=times new roman,times;"+
	"Trebuchet MS=trebuchet ms,geneva;"+
	"Verdana=verdana,geneva;"+
	"Webdings=webdings;"+
	"Wingdings=wingdings,zapf dingbats"
});
</script>
<form name=FindProduct onsubmit="return SelectProductsInInventory();">
<div class="container-fluid">
	<div class='row'>
		<div class='col-xs-2 col-lg-2'><input id=SearchInProduct class='form-control' type=text placeholder='UPC, Name or Category' value='<?=$_GET[SearchInProduct];?>'></div>
		<div class='col-xs-4 col-lg-4'>
			<input type=submit class='btn btn-default' value='SEARCH'>
			<div id=WaitingForResultsGif style='display: inline;'></div>
			<button class='btn btn-default' onClick=AddNewProduct();>ADD NEW PRODUCT</button>
			
		</div>
		<div class='col-xs-1 col-lg-1' style='text-align: left;'></div>
	</div>
</div>
</form>

<div class="modal fade" id="AddProductModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
	<div class="modal-content">
	  <div class="modal-header">
		<h4 class="modal-title" id="AddProductModal_title">Add New Product</h4>
	  </div>
	  <div class="modal-body">
			<div style="display: inline;">
				UPC Code <input id=UPC type=text class='form-control'><br>
				Name <input id=Name type=text class='form-control'><br>
				Description <textarea class=Description id=Description name=Description></textarea><br>
				Category <? echo getProductCategories(); ?><br>
				Price <input id=Price type=text class='form-control'><br>
				Cost <input id=Cost type=text class='form-control' value='0.00'><br>
				Commission % <input id=CommissionPercent type=text class='form-control' value='0.00'><br>
				</div>
	  </div>
      <div class="modal-footer">
        <a href="#" class="btn btn-default" data-dismiss="modal">Close</a>
		<a href="#" id="addProductModal_confirm" class="btn btn-default" onClick=AddNewProductComplete();>ADD PRODUCT</a>
      </div>
	</div>
  </div>
</div>

<div id=InventoryOutput class="container-fluid"></div>

<?
function getProductCategories()
{
	$result = Query ("SELECT * FROM ProductCategories ORDER BY ProductCategory");
	$Output = "<select id=ProductCategory class='form-control'>";
	while ($row = mysql_fetch_object($result))
	{
		$Output .= "<option value='$row->ProductCategory'>$row->ProductCategory</option>";
	}
	$Output .= "</select>";
	return $Output;
	
}
?>
<script type="text/javascript">
		var fd = new FormData();
        $("#InventoryOutput").on("change",".ImageLink",function(){
        	var current = $(this);
        	var imageLink = current[0].files[0];
        	var ProductID = current.parent(".LocalImageSection").siblings(".ProductID").val();
        	if(imageLink && imageLink.name !='')
			{
				fd.append("image",imageLink);
				fd.append("Action","ProductImageUpload");
				fd.append("ProductID",ProductID);
				$.ajax({
					url  : 'MiscUpdates.php',
					type : 'POST',
					data : fd,
					processData: false,
		    		contentType: false,
					success : function(result){
						var imgScr = result;
						current.parent(".LocalImageSection").siblings(".imageSection").find(".ImageProduct").show();
						current.parent(".LocalImageSection").siblings(".imageSection").find("a.fancybox").show();
						current.parent(".LocalImageSection").siblings(".imageSection").find(".delete_icon").css("display","inline");
						current.parent(".LocalImageSection").siblings(".imageSection").find(".ImageProduct").attr("src","");
						current.parent(".LocalImageSection").siblings(".imageSection").find(".ImageProduct").attr("src",imgScr);
						
						
					}
				});
				
			}
        });

        $("#InventoryOutput").on("change",".IsAvailableOnline",function(){
        	var IsAvailableOnline = $(this).val();
        	var current = $(this);
        	var ProductID = $(this).data("id");
        	if(IsAvailableOnline && IsAvailableOnline!="")
        	{
        		$.ajax({
					url  : 'MiscUpdates.php',
					type : 'POST',
					data : {ProductID:ProductID,IsAvailableOnline:IsAvailableOnline,Action:'AvailableOnlineProduct'},
					success : function(result){
						if(result == '1')
						{
							current.children("option").eq("1").prop("selected",true);
						}
						else if(result == '0')
						{
							current.children("option").eq("0").prop("selected",true);
						}	
						
						
					}
				});
        	}
        });
        function ExternalProductImage(e)
        {
        	var ExternalLink = $(e);
			var ExternalImage = ExternalLink.siblings(".ExternalImage").val();
			var ProductID = ExternalLink.parent(".ExternalLinkSection").siblings(".ProductID").val();
			if(ExternalImage && ExternalImage!="")
			{
				$.ajax({
					url  : 'MiscUpdates.php',
					type : 'POST',
					data : {ProductID:ProductID,ExternalImage:ExternalImage,Action:'ExternalProductImage'},
					success : function(result){
						ExternalLink.parent(".ExternalLinkSection").siblings(".imageSection").find(".delete_icon").css("display","inline");
						ExternalLink.parent(".ExternalLinkSection").siblings(".imageSection").find("a").css("display","inline");
						ExternalLink.parent(".ExternalLinkSection").siblings(".imageSection").find("a").attr("href",result);
						ExternalLink.parent(".ExternalLinkSection").siblings(".imageSection").find("img").attr("src",result);
						ExternalLink.parent(".ExternalLinkSection").siblings(".imageSection").find("img").show();
						ExternalLink.siblings(".ExternalImage").val('');
					}
				});
			}
			else
			{
				alert("Product image is required");
			}
        }
      

        function deleteProductImage(e)
		{
			var confirm_msg = confirm("Are you sure you want to delete this image?");
			var current = $(e);
			var ProductID = current.closest(".imageSection").siblings(".ProductID").val();
			if(confirm_msg)
			{
				$.ajax({
						url  : 'MiscUpdates.php',
						type : 'POST',
						data : {Action:'deleteProductImage',ProductID:ProductID},
						success : function(result){
							if(result == 'OK')
							{
								current.closest(".imageSection").siblings("a").children(".ImageProduct").hide();
								current.closest(".imageSection").find("a.fancybox").hide();
								current.closest(".imageSection").find(".ImageProduct").attr("src","");
								current.hide();
							}
						}
					});
			}

		}
	$(".fancybox").fancybox({
        openEffect: "none",
        closeEffect: "none"
    });
		
</script>