<?
	include_once('Connection.php');
	
	if($Opt->getOpt("EnableAppointmentsNew"))
	{
		include_once('AppointmentsNew.php');
	}
	else
	{
	if ($_GET[StartDate] == "")
	{
		$StartDate = Date("Y-m-d");
	}
	else
	{
		$StartDate = $_GET[StartDate];
	}
	
	if ($_GET[EndDate] == "")
	{
		$EndDate = Date("Y-m-d", strtotime("Now +14 days"));
	}
	else
	{
		$EndDate = $_GET[EndDate];
	}
	
	$Search = $_GET[Search];
?>
<script>
$(document).ready(function() {
	getAppointments();
	$('.selectpicker').selectpicker();
});

function getAppointments()
{
	var Appointment_element = document.getElementById("Appointments");
	if(Appointment_element == null)
	{
		// Do Nothing
	}
	else
	{
		var StartDate = document.getElementById("StartDate").value;
		var EndDate = document.getElementById("EndDate").value;
		var Search = document.getElementById("Search").value;
		document.getElementById("SearchButton").innerHTML = "Loading ... <img src='images/load.gif' width=20 height=20>";
		
		getAppointments_xmlhttp=new XMLHttpRequest();
		getAppointments_xmlhttp.onreadystatechange=function()
		{
			if (getAppointments_xmlhttp.readyState==4 && getAppointments_xmlhttp.status==200)
			{
				document.getElementById("Appointments").innerHTML = getAppointments_xmlhttp.responseText;
				document.getElementById("SearchButton").innerHTML = "SEARCH";
			}
		}

		getAppointments_xmlhttp.open("GET","MiscUpdates.php?Action=getAppointments&StartDate=" + StartDate + "&EndDate=" + EndDate + "&Search=" + encodeURIComponent(Search),true);
		getAppointments_xmlhttp.send();
	}
}

function deleteAppointment(AppointmentID)
{
	var ConfirmDelete = confirm("Are you sure you want to cancel this appointment?");
	if (! ConfirmDelete) return;
	
 	deleteAppointments=new XMLHttpRequest();
	deleteAppointments.onreadystatechange=function()
	{
	  if (deleteAppointments.readyState==4 && deleteAppointments.status==200)
		{
			getAppointments();
		}
	}
	deleteAppointments.open("GET","MiscUpdates.php?Action=deleteAppointments&AppointmentID=" + AppointmentID,true);
	deleteAppointments.send();
}

function deleteShift(ScheduleID)
{
	var ConfirmDelete = prompt("What is the reason for removing this shift?");
	if (ConfirmDelete == null || ConfirmDelete == "") return false;
	
 	deleteSchedule=new XMLHttpRequest();
	deleteSchedule.onreadystatechange=function()
	{
	  if (deleteSchedule.readyState==4 && deleteSchedule.status==200)
		{
			getAppointments();
		}
	}

	deleteSchedule.open("GET","MiscUpdates.php?Action=deleteSchedule&ScheduleID=" + ScheduleID + "&Note=" + encodeURIComponent(ConfirmDelete),true);
	deleteSchedule.send();
}

function addShift()
{
	var ClubLocation = $("select[name='ClubLocation']").val();
	var ShiftDate = document.getElementById("ShiftDate").value;
	var ShiftStartTime = document.getElementById("ShiftStartTime").value;
	var ShiftEndTime = document.getElementById("ShiftEndTime").value;
	var ShiftAssignedTo = document.getElementById("ShiftAssignedTo").value;
	var ShiftType = document.getElementById("ShiftType").value;
	var ShiftNotes = document.getElementById("ShiftNotes").value;
	
	if (ClubLocation == '')
	{
		alert("Specify shift location.");
		return false;
	}
	
	if (ShiftDate == '')
	{
		alert("Specify shift date.");
		return false;
	}
	
	if (ShiftStartTime == '')
	{
		alert("Specify shift start time.");
		return false;
	}
	
	if (ShiftEndTime == '')
	{
		alert("Specify shift end time.");
		return false;
	}
	
	if (ShiftAssignedTo == '')
	{
		alert("Specify who shift is assigned to.");
		return false;
	}
	
	if (ShiftType == '')
	{
		alert("Specify type of shift.");
		return false;
	}

	var setShift=new XMLHttpRequest();
	setShift.onreadystatechange=function()
	  {
	  if (setShift.readyState==4 && setShift.status==200)
		{
			if (setShift.responseText == "OK")
			{
				getAppointments();
				$("#AddShiftModal").modal("hide");
			}
			else
			{
				alert(setShift.responseText);
			}
		}
	  }

	setShift.open("GET","MiscUpdates.php?Action=addSchedule&ClubLocation=" + encodeURIComponent(ClubLocation) + "&ShiftDate=" + ShiftDate + "&ShiftStartTime=" + ShiftStartTime + "&ShiftEndTime=" + ShiftEndTime + "&ShiftAssignedTo=" + ShiftAssignedTo + "&ShiftType=" + ShiftType + "&ShiftNotes=" + encodeURIComponent(ShiftNotes));
	setShift.send();
}
</script>
<div class="row">
	<div class="col-xs-12 col-lg-12">
		<div class="row" style='text-align: center;'>
			<div class="col-xs-6 col-lg-2" style='text-align: left;'>
				<input type=date class='form-control' id=StartDate value='<? echo $StartDate; ?>'>
			</div>
			<div class="col-xs-6 col-lg-2" style='text-align: left;'>
				<input type=date class='form-control' id=EndDate value='<? echo $EndDate; ?>'>
			</div>
			<div class="col-xs-12 col-lg-2" style='text-align: left;'>
				<input type=text class='form-control' id=Search placeholder='Employee Name'>
			</div>
			<div class="col-xs-6 col-lg-6" style='text-align: left;'>
				<button id=SearchButton class="btn btn-default" onClick=getAppointments();>SEARCH</button>	
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="AddShiftModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
	<div class="modal-content">
	  <div class="modal-header">
		<h4 class="modal-title" id="AddShiftModal_title">Add a Shift</h4>
	  </div>
	  <div class="modal-body">
			<p><h4>Shift Date/Time</h4>
			<div class='row'>
				<div class='col-xs-6 col-lg-6'>
					<select multiple="multiple" class='selectpicker' name="ClubLocation">
						<option value=''>--</option>
					<?
						foreach ($ClubLocations AS $ClubLocation)
						{
							echo "<option value='$ClubLocation'>$ClubLocation</option>";
						}
					?>
					</select>
				</div>
				<div class='col-xs-6 col-lg-6'>
					<input type=date class='form-control' id=ShiftDate onChange=getExistingShifts();>
				</div>
			</div>
			<div class='row'>
				<div class='col-xs-6 col-lg-6'>
					<input type=text class='form-control' id=ShiftStartTime placeholder='Start Time' onChange=getExistingShifts();>
				</div>
				<div class='col-xs-6 col-lg-6'>
					<input type=text class='form-control' id=ShiftEndTime placeholder='End Time' onChange=getExistingShifts();>
				</div>
			</div>				
			<div id=ExistingShifts></div>
			</p>
			
			<p><h4>Assigned To</h4>
			<select id=ShiftAssignedTo class='form-control'>
				<option value=''>--</option>
				<?
				$query = "SELECT * FROM Employee WHERE Active=1 ORDER BY Name";
				$result = Query($query);
				while ($EmployeeListRow = mysql_fetch_object($result))
				{
					echo "<option value='$EmployeeListRow->Name'>$EmployeeListRow->Name</option>";
				}
				?>
			</select></p>
			
			<p><h4>Shift Type</h4>
			<select id=ShiftType class='form-control'>
				<option value=''>--</option>
				<?
					$ShiftTypes = explode(",", $Opt->getOpt("ShiftTypes"));
					foreach ($ShiftTypes AS $ShiftType)
					{
						echo "<option value='$ShiftType'>$ShiftType</option>";
					}
				?>
			</select></p>
			
			<p><h4>Shift Notes</h4>
			<textarea class='form-control' id=ShiftNotes rows=5></textarea>
			</p>
	  </div>
      <div class="modal-footer">
		<a href="#" class="btn btn-default" onClick='addShift();'>ADD SHIFT</a>
        <a href="#" class="btn btn-default" data-dismiss="modal">Close</a>
      </div>
	</div>
  </div>
</div>

<p>
<div id=Appointments></div></p>
<? } ?>