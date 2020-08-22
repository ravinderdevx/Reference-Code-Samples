 function startRectCrop() {
            cropReset();

            $j('#cropper').css('transform', 'rotate(0deg)');

            $j('#cropper').height($j('#cropper').height() + 5);            

            cropType = 'Rect';
            $j("#div_clip").show();
            if ($j("#clipdetailarea").is(':visible')) {
                $j("#clipdetailarea").hide();
            }
           
            rotatedWidthHeight();
            
            if (($j(".canvas").position().top == 0) || ($j(".canvas").position().top >= (-$j('#div_clip').height()))) {
                if ($j('#rtext').val() == '0') {
                    $j(".canvas").css('top', $j('#div_clip').height());
                    $j("#cropper").css('top', $j('#div_clip').height());
                }
            }


            var tlx = ($j('#viewer').width() / 2) - parseInt($j('#cropper').css('left')) - 100;
            
            var tly = 120 - parseInt($j('#cropper').css('top'))
            var rectr = 200
            addCpt(tlx, tly);
            addCpt((tlx + rectr), tly);
            addCpt((tlx + rectr), (tly + rectr));
            addCpt(tlx, (tly + rectr));
            drawCropArea(cpt);
            cropHistory.push(cpt.slice(0))
            createLineMaping();
            $j('.alertBox').stop().removeAttr('style');
            if (zoomin > 0) {
                $j('#cropper').draggable('enable');
            }
            else {
                $j('#cropper').draggable('disable');
            }            
            $j("#addmoredetail").text("Treasure box");
            $j("#txtTagsLbl").val("");
            $j("#div_othertags").hide();
            $j('#div_clip').css({ 'left': $j('.btn-crop').offset().left - 22, 'top': '0px' })
            $j("#crop_tools").hide();
            $j("#clipdetailarea").css('display', 'none');
            $j(".checkbox").addClass("checked");
            $j("#publicCheckbox").attr('checked', true);
            isrect = true;
            ispoly = false;
            originalcpt = cpt.slice();

            /*--for multiple tagging*/
            isopendropdown = false;
            $j(".btn-group").removeClass("open");
            $j("#Multidropdown").css('display', 'none');
            $j("#btn_dropdownbutton").css('display', 'block');
            $j("#checkedpersonid").val('');
            $j("#personid").val('');
            cptFordeskew = cpt.slice();
            isCropDrag = false;
        }


function cropReset() {
            $j('#hlayer').removeAttr('style');
            cropType = '';
            cpt = [];
            ncpt = 0;
            $j('.cpt').remove();
            $j('#cropper').attr('style', $j('.canvas').attr('style'));
            $j('#cropper').css({ 'cursor': 'default', 'background': 'none' });
            $j('#cropper').fadeIn(200);
            drawCropArea(cpt);
            $j('#cropper').unbind('click');
            cropHistory = [];
            cropRedo = [];
            justDrag = false;
            isrect = false;
            $j('#txtTitle').attr('placeholder', 'Details about this clip (optional)');
            $j('#txtFolderName').attr('placeholder', 'Type a name here');
            $j("#div_clip").hide();           
            $j('#ddlTags').css({ 'border-color': '', 'background-color': '' })
            $j("#spn_tags").hide();
            isnotremovefadeout = false;
        }
function rotatedWidthHeight() {

            width = $j('#cropper').width();
            height = $j('#cropper').height();
            angle = $j('#rtext').val();
            var rad = angle * Math.PI / 180,
                sin = Math.sin(rad),
                cos = Math.cos(rad);

            newWidth = Math.abs(width * cos) + Math.abs(height * sin),
               newHeight = Math.abs(width * sin) + Math.abs(height * cos);
            $j('#cropper').width(newWidth);
            $j('#cropper').height(newHeight);            

            $j('#cropper').css('left', $j('#cropper').position().left - ((newWidth - width) / 2));
            $j('#cropper').css('top', $j('#cropper').position().top - ((newHeight - height) / 2));


            $j('#crop_area').width(newWidth);
            $j('#crop_area').height(newHeight);
        }

 function addCpt(px, py) {
            cpt[ncpt] = [px, py];
            $j('#cropper').prepend('<div class="cpt pid' + ncpt + '" data-id="' + ncpt + '" style="top:' + py + 'px;left:' + px + 'px"></div>');
            ncpt++;
            addCptEvents();
        }


function addCptEvents() {
            $j(".cpt").draggable({
                containment: "parent",
                drag: function () {
                    if (isrect) {
                        switch ($j(this).attr('data-id')) {
                            case "0":
                                {
                                    cpt[$j(this).attr('data-id')] = [parseInt($j(this).css('left')), parseInt($j(this).css('top'))];
                                    cpt[3] = [parseInt($j(this).css('left')), cpt[3][1]];
                                    cpt[1] = [cpt[1][0], parseInt($j(this).css('top'))];
                                    $j('.cpt[data-id="3"]').css('left', $j(this).css('left'));
                                    $j('.cpt[data-id="1"]').css('top', $j(this).css('top'));
                                    break;
                                }
                            case "1":
                                {
                                    cpt[$j(this).attr('data-id')] = [parseInt($j(this).css('left')), parseInt($j(this).css('top'))];
                                    cpt[2] = [parseInt($j(this).css('left')), cpt[2][1]];
                                    cpt[0] = [cpt[0][0], parseInt($j(this).css('top'))];
                                    $j('.cpt[data-id="2"]').css('left', $j(this).css('left'));
                                    $j('.cpt[data-id="0"]').css('top', $j(this).css('top'));
                                    break;
                                }
                            case "2":
                                {
                                    cpt[$j(this).attr('data-id')] = [parseInt($j(this).css('left')), parseInt($j(this).css('top'))];
                                    cpt[3] = [cpt[3][0], parseInt($j(this).css('top'))];
                                    cpt[1] = [parseInt($j(this).css('left')), cpt[1][1]];
                                    $j('.cpt[data-id="1"]').css('left', $j(this).css('left'));
                                    $j('.cpt[data-id="3"]').css('top', $j(this).css('top'));
                                    break;
                                }
                            case "3":
                                {
                                    cpt[$j(this).attr('data-id')] = [parseInt($j(this).css('left')), parseInt($j(this).css('top'))];
                                    cpt[0] = [parseInt($j(this).css('left')), cpt[0][1]];
                                    cpt[2] = [cpt[2][0], parseInt($j(this).css('top'))];
                                    $j('.cpt[data-id="0"]').css('left', $j(this).css('left'));
                                    $j('.cpt[data-id="2"]').css('top', $j(this).css('top'));
                                    break;
                                }
                        }
                    }
                    else {
                        cpt[$j(this).attr('data-id')] = [parseInt($j(this).css('left')), parseInt($j(this).css('top'))];
                    }
                    drawCropArea(cpt);
                },
                stop: function () {
                    if (isrect) {
                        switch ($j(this).attr('data-id')) {
                            case "0":
                                {
                                    cpt[$j(this).attr('data-id')] = [parseInt($j(this).css('left')), parseInt($j(this).css('top'))];
                                    cpt[3] = [parseInt($j(this).css('left')), cpt[3][1]];
                                    cpt[1] = [cpt[1][0], parseInt($j(this).css('top'))];
                                    $j('.cpt[data-id="3"]').css('left', $j(this).css('left'));
                                    $j('.cpt[data-id="1"]').css('top', $j(this).css('top'));
                                    break;
                                }
                            case "1":
                                {
                                    cpt[$j(this).attr('data-id')] = [parseInt($j(this).css('left')), parseInt($j(this).css('top'))];
                                    cpt[2] = [parseInt($j(this).css('left')), cpt[2][1]];
                                    cpt[0] = [cpt[0][0], parseInt($j(this).css('top'))];
                                    $j('.cpt[data-id="2"]').css('left', $j(this).css('left'));
                                    $j('.cpt[data-id="0"]').css('top', $j(this).css('top'));
                                    break;
                                }
                            case "2":
                                {
                                    cpt[$j(this).attr('data-id')] = [parseInt($j(this).css('left')), parseInt($j(this).css('top'))];
                                    cpt[3] = [cpt[3][0], parseInt($j(this).css('top'))];
                                    cpt[1] = [parseInt($j(this).css('left')), cpt[1][1]];
                                    $j('.cpt[data-id="1"]').css('left', $j(this).css('left'));
                                    $j('.cpt[data-id="3"]').css('top', $j(this).css('top'));
                                    break;
                                }
                            case "3":
                                {
                                    cpt[$j(this).attr('data-id')] = [parseInt($j(this).css('left')), parseInt($j(this).css('top'))];
                                    cpt[0] = [parseInt($j(this).css('left')), cpt[0][1]];
                                    cpt[2] = [cpt[2][0], parseInt($j(this).css('top'))];
                                    $j('.cpt[data-id="0"]').css('left', $j(this).css('left'));
                                    $j('.cpt[data-id="2"]').css('top', $j(this).css('top'));
                                    break;
                                }
                        }
                    }
                    else {
                        cpt[$j(this).attr('data-id')] = [parseInt($j(this).css('left')), parseInt($j(this).css('top'))];
                    }
                    drawCropArea(cpt);
                    cropHistory.push(cpt.slice(0));
                    createLineMaping();
                    cptclone = [];
                    directionflag = "";
                    originalcpt = cpt.slice();
                    cptFordeskew = [];
                    cptFordeskew = cpt.slice();
                    isCropDrag = true;
                }
            })
        }

 function drawCropArea(apts) {
            var diffwidth = 0, diffh = 0;
            if (newWidth != undefined) {
                diffwidth = (newWidth - width); diffh = (newHeight - height);
            }
            var canvas = document.getElementById("crop_area");
            var ctx = canvas.getContext("2d");
            canvas.width = parseInt($j('.canvas').width() + (diffwidth));            
            // for the brightness contrast by rakesh/rr
            var bright = $j("#brightnessVal").text();
            var contra = $j('#contrastVal').text();

            canvas.height = parseInt($j('.canvas').css('height')) + diffh;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            var coords = '';            
            //for the brightness contrast by rakesh/rr
            if (contra == "0" && bright == "0") {
                ctx.fillStyle = "rgba(255,255,255,0.3)";
                ctx.strokeStyle = "white";
            }
            else if (contra >= 0 && bright > 0) {
                ctx.fillStyle = "rgba(0, 0, 0,0.2)";
                ctx.strokeStyle = "white";
            }
            else if (contra > 0 && bright <= 0) {
                ctx.fillStyle = "rgba(0, 0, 0,0.2)";
                ctx.strokeStyle = "white";
            }
            else if (contra <= 0 && bright >= -70) {
                ctx.fillStyle = "rgba(0,0,0,0.2)";
                ctx.strokeStyle = "white";
            }
            else if (contra <= 0 && bright < 0) {
                ctx.fillStyle = "rgba(255,255,255,0.2)";
                ctx.strokeStyle = "white";
            }
            else if (contra < 0 && bright > 0) {
                ctx.fillStyle = "rgba(255,255,255,0.2)";
                ctx.strokeStyle = "white";
            }
            else if (contra < 0 && bright < 0) {
                ctx.fillStyle = "rgba(0,0,0,0.2)";
                ctx.strokeStyle = "white";
            }
            else {
                ctx.fillStyle = "rgba(255,255,255,0.2)";
                ctx.strokeStyle = "white";
            }

            ctx.beginPath();
            var startDrawing = true;
            var sx, sy = 0;
            $j.each(apts, function (index, xy) {
                if (startDrawing) {
                    sx = xy[0];
                    sy = xy[1];
                    ctx.moveTo(xy[0], xy[1]);
                    coords = xy[0] + ',' + xy[1]
                    startDrawing = false;
                } else {
                    ctx.lineTo(xy[0], xy[1]);
                    coords += ',' + xy[0] + ',' + xy[1];
                }
            })
            ctx.lineTo(sx, sy);// end Points ----
            ctx.strokeStyle = "white";
            ctx.stroke();
            ctx.closePath();
            ctx.fill();

            //========================================
            $j('#mapArea').attr('coords', coords);

        }

  function createLineMaping() {
            $j('.mapLine').unbind('click');
            $j('.mapLine').remove();
            var sx, sy, px, py = 0;
            var startlineDrawing = true;
            $j.each(cpt, function (index, xy) {
                if (startlineDrawing) {
                    sx = xy[0];
                    sy = xy[1];
                    px = xy[0];
                    py = xy[1];
                    startlineDrawing = false;
                } else {
                    var lineCords = (px + 2) + ',' + (py + 2) + ',' + (xy[0] + 2) + ',' + (xy[1] + 2) + ',' + (xy[0] - 2) + ',' + (xy[1] - 2) + ',' + (px - 2) + ',' + (py - 2);
                    $j('#cropObjects').append('<area shape="poly" coords="' + lineCords + '" class="mapLine" alt="' + (index - 1) + '">');
                    px = xy[0];
                    py = xy[1];
                }
            })
            var lineCords = (px + 2) + ',' + (py + 2) + ',' + (sx + 2) + ',' + (sy + 2) + ',' + (sx - 2) + ',' + (sy - 2) + ',' + (px - 2) + ',' + (py - 2);
            $j('#cropObjects').append('<area shape="poly" coords="' + lineCords + '"class="mapLine" alt="' + (cpt.length - 1) + '">');

            $j('.mapLine').click(function (e) {
                $j('.cursor-attr').css({ 'top': -100, 'left': -100 })
                var px = e.pageX - $j('#cropper').offset().left;
                var py = e.pageY - $j('#cropper').offset().top;                
                return false;
            }).mouseover(function (e) {
                $j('.cursor-attr').children('img').attr('src', 'images/cursor-plus.png')
            }).mouseout(function () {
                $j('.cursor-attr').css({ 'top': -100, 'left': -100 })
            }).mousemove(function (e) {
                $j('.cursor-attr').css({ 'top': e.pageY - 15, 'left': e.pageX + 5 })
            })
        }
		
		
		function ObituariesShareOnFaceBook(linkUrl, picUrl, title, caption, description) {

    if (picUrl == "") {
        FB.ui({
            method: 'feed',
            link: linkUrl,
            name: title,
            caption: caption,
            description: description
        }, function (response) {

        });
    }
    else {
        FB.ui({
            method: 'feed',
            link: linkUrl,
            picture: picUrl,
            name: title,
            caption: caption,
            description: description
        }, function (response) {

        });
    }


}

 $(window).scroll(function () {
                inProcess = false;
                if (($("#hdnPage").val().toLowerCase().indexOf(("Archivesclip").toLowerCase()) >= 0)) {
                    if ($("#Clipping").hasClass('clip-btn active'))                        
                        var x = $("#hdnCurrentPageforclip").val();
                    var totalcount = $("#TotalCount").val();
                    var totalpages = Math.ceil(totalcount / 9);
                    if (flag && $(window).scrollTop() >= (($(document).height() - $(window).height()) - 800) && parseInt($("#hdnCurrentPageforclip").val()) <= totalpages && parseInt($("#hdnCurrentPageforclip").val()) > 1) {

                        flag = false;
                        var SortColumn = $("#ddlSrchclip").val();
                        var Search = $("#txtsearchimage").val();
                        var folderID = $("#hdnFolderId").val();
                        var tagId = $("#hdnTagId").val();
                        var UserId = $("#hdnUserId").val();                       

                        SearchProfileClip(UserId, SortColumn, Search, folderID, tagId);
                    }
                    return false;
                }
                //For Archive List Page
                if (($("#hdnPage").val().toLowerCase().indexOf(("ActiveArchives").toLowerCase()) >= 0)) {

                    var x = $("#hdntotalcoumtarchive").val();
                    var restpage = 0;
                    var totalpage = 0;

                    if (parseInt(x) > 0) {
                        totalpage = parseInt(x) / 5;
                        restpage = parseInt(x) % 5;
                        if (restpage > 0) {
                            totalpage = totalpage + 1;
                        }
                    }
                    if (inProcessArchive && $(window).scrollTop() >= (($(document).height() - $(window).height()) - 800) && parseInt($("#hdnArchiveCurrentPage").val()) < parseInt(totalpage) && parseInt($("#hdnArchiveCurrentPage").val()) > 0 && $("#MyClipping").hasClass('active')) {
                        inProcessArchive = false;

                        if ($("#hdnPage").length > 0) {
                            $("#hdnArchiveCurrentPage").val((parseInt($("#hdnArchiveCurrentPage").val()) + 1).toString());
                            if ($("#hdnPage").val() == "ActiveArchives") {
                                GetAllarchivesList();
                            }
                        }
                    }
                    return false;
                }
                if (($(window).scrollTop() >= ($(document).height() - $(window).height()) * 0.1) && parseInt($("#hdnCurrentPage").val()) > 0 && $('#sortabledragdrop').html() == "") {


                    if ($("#hdnPage").length > 0 && isScrollable) {
                        $("#hdnCurrentPage").val((parseInt($("#hdnCurrentPage").val()) + 1).toString());
                        if ($("#hdnPage").val() == "allclips") {

                            var clipsearchdropdown = $("#ddlSrchclip").val();
                            var clipsearch = $("#txtsearchimage").val();
                            var folderId = $("#hdnFolderId").val();
                            var tagId = $("#hdnTagId").val();

                            if ($("#MyClipping").hasClass('active')) {
                                var userid = $("#hdnuserid").val();
                                if (!$("#divEditPopup").is(':visible')) {
                                    SerachClip(userid, clipsearchdropdown, clipsearch, folderId, tagId)
                                }
                            }
                            else {
                                if (!$("#divEditPopup").is(':visible')) {
                                    SerachClip(0, clipsearchdropdown, clipsearch, folderId, tagId)
                                }
                            }
                        }
                        else if ($("#hdnPage").val() == "userclips") {
                            var userid = $("#user_id").val();
                            var folderId = $("#hdnFolderId").val();
                            var tagId = $("#hdnTagId").val();
                            if (!$("#divEditPopup").is(':visible')) {
                                SerachClip(userid, "clipdate-desc", "", folderId, tagId)
                            }
                        }
                    }
                }

            });