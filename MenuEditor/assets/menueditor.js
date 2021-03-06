$(document).ready(function () {
    setTimeout(function () {
        $(".alert").fadeOut()
    }, 5000);
    
    $(".nav-tabs").on("click", "a", function (b) {
        b.preventDefault();
        $(this).tab("show")
    });
    
    $(".me-menu").nestable({
        maxDepth: 100,
        threshold: 15
    });
    
    $("div.me-addct").select2({
        placeholder: trans_additem,
        minimumInputLength: 3,
        ajax: {
        	type: 'post',
        	url: '/bolt/extensions/menu-editor',
        	dataType: 'json',
        	quietMillis: 100,
        	data: function(term, page) {
        		return {
        			action: 'search-contenttypes',
					ct: $('select.me-addct-filter').val(),
					q: term,
					page_limit: 100
        		};
        	},
        	results: function(data, page) {
        		var records = Array();
        		for (record in data.records[0]) {
        			console.log(data.records[0][record]);
        			records.push({id:data.records[0][record].values.id, text:data.records[0][record].values.title, slug:data.records[0][record].values.slug, contenttype:data.records[0][record].contenttype.slug});
        		}
        		return {results: records}
        	}
        }
    });
    
    $("select.me-addsp").select2({
        placeholder: trans_additem
    });
    
    $(document).on("click", ".dd-edit", function () {
        var c = $(this).parent().children("div.dd-editpanel");
        var b = false;
        if ($(c).hasClass("hidden")) {
            b = true
        }
        $("div.dd-editpanel").addClass("hidden");
        if (b) {
            $(c).removeClass("hidden")
        } else {
            $(c).addClass("hidden")
        }
    });
    
    $(".me-addct").on("change", function () {
    	var slug = $($(this).select2("data"))[0].slug;
        $("#me-addct-label").val($(this).select2("data").text);
        $("#me-addct-path").val($($(this).select2("data"))[0].contenttype + "/" + slug)
    });
    
    $(".me-addsp").on("change", function () {
        $("#me-addsp-label").val($(this).select2("data").text);
        $("#me-addsp-path").val($(this).select2("val"))
    });
    
    $("button#me-addmenu").click(function () {
        var c = $("input#me-addmenu-name").val();
        c = c.replace(/[^a-z0-9-_]/gi, "");
        if (c == "") {
            return false
        }
        var b = [];
        $(".me-menu").each(function () {
            b.push($(this).data("menuname"))
        });
        if ($.inArray(c, b) > -1) {
            bootbox.alert(trans_menualreadyexists, function () {});
            return false
        } else {
            $(".nav-tabs li:last").before('<li><a href="#me-tab-' + b.length + '" data-toggle="tabs">' + c + "</a></li>");
            $(".tab-content div:last").before('<div class="tab-pane" id="me-tab-' + b.length + '"><div class="dd me-menu" id="me-menu-' + b.length + '" data-menuname="' + c + '"><ol class="dd-list me-menulist"></ol></div></div>');
            $("input#me-addmenu-name").val("");
            $(".nav-tabs li").removeClass("active");
            $(".nav-tabs li:last").prev("li").addClass("active");
            $(".tab-content div").removeClass("active");
            $(".tab-content div:last").prev("div").addClass("active");
            $(".me-menu").nestable({
                maxDepth: 100,
                threshold: 15
            })
        }
    });
    
    $(".me-additem").click(function () {
        var f = '<li class="dd-item dd3-item" [attributes] style="display: none;"><div class="dd-handle dd3-handle"></div><div class="dd3-content">[label]</div><div class="dd-edit dd3-edit pull-right"></div><div class="dd-editpanel well hidden">[editTemplate]<button type="button" class="btn btn-primary me-updateitem">' + trans_save + '</button> <button type="button" class="btn btn-danger me-deleteitem">' + trans_removefrommenu + "</button></div></li>";
        var d = '[path]<div class="left-inner-addon"><i class="icon-pushpin"></i><input class="me-input" type="text" data-tag="label" value="[label]" placeholder="' + trans_label + '"></div>[link]<div class="left-inner-addon"><i class="icon-info-sign"></i><input class="me-input" type="text" data-tag="title" value="[title]" placeholder="' + trans_title + '"></div><div class="left-inner-addon"><i class="icon-eye-open"></i><input class="me-input" type="text" data-tag="class" value="[class]" placeholder="' + trans_class + '"></div>';
        var i = '<div class="left-inner-addon"><i class="icon-bolt"></i><input class="me-input" type="text" value="[path]" disabled="disabled" style="width: 25%;"></div>';
        var h = '<div class="left-inner-addon"><i class="icon-link"></i><input class="me-input" type="text" data-tag="link" value="[link]" placeholder="' + trans_url + '"></div>';
        var g = f;
        if ($("#" + this.id + "-label").val() == "") {
            var e = "<em>" + trans_nolabelset + "</em>"
        } else {
            var e = $("#" + this.id + "-label").val()
        }
        g = g.replace("[label]", e);
        var c = "";
        if (this.id == "me-addurl") {
            c = 'data-label="' + $("#me-addurl-label").val() + '" data-link="' + $("#me-addurl-link").val() + '" data-title="' + $("#me-addurl-title").val() + '" data-class="' + $("#me-addurl-class").val() + '"';
            d = d.replace("[path]", "");
            h = h.replace("[link]", $("#me-addurl-link").val());
            d = d.replace("[link]", h);
            d = d.replace("[label]", $("#me-addurl-label").val());
            d = d.replace("[title]", $("#me-addurl-title").val());
            d = d.replace("[class]", $("#me-addurl-class").val());
            $("#me-addurl-label").val("");
            $("#me-addurl-link").val("");
            $("#me-addurl-class").val("");
            $("#me-addurl-title").val("")
        } else {
            if (this.id == "me-addct") {
                if ($("#me-addct-path").val() == "") {
                    $(".select2-container.me-addct").addClass("select2error");
                    $("select.me-addct").on("change", function () {
                        $(".select2-container.me-addct").removeClass("select2error");
                        $("select.me-addct").off("change")
                    });
                    return false
                }
                c = 'data-label="' + $("#me-addct-label").val() + '" data-path="' + $("#me-addct-path").val() + '" data-title="' + $("#me-addct-title").val() + '" data-class="' + $("#me-addct-class").val() + '"';
                d = d.replace("[link]", "");
                i = i.replace("[path]", $("#me-addct-path").val());
                d = d.replace("[path]", i);
                d = d.replace("[label]", $("#me-addct-label").val());
                d = d.replace("[title]", $("#me-addct-title").val());
                d = d.replace("[class]", $("#me-addct-class").val());
                $("#me-addct-label").val("");
                $("#me-addct-path").val("");
                $("#me-addct-class").val("");
                $("#me-addct-title").val("")
            } else {
                if (this.id == "me-addsp") {
                    if ($("#me-addsp-path").val() == "") {
                        $(".select2-container.me-addsp").addClass("select2error");
                        $("select.me-addsp").on("change", function () {
                            $(".select2-container.me-addsp").removeClass("select2error");
                            $("select.me-addsp").off("change")
                        });
                        return false
                    }
                    c = 'data-label="' + $("#me-addsp-label").val() + '" data-path="' + $("#me-addsp-path").val() + '" data-title="' + $("#me-addsp-title").val() + '" data-class="' + $("#me-addsp-class").val() + '"';
                    d = d.replace("[link]", "");
                    i = i.replace("[path]", $("#me-addsp-path").val());
                    d = d.replace("[path]", i);
                    d = d.replace("[label]", $("#me-addsp-label").val());
                    d = d.replace("[title]", $("#me-addsp-title").val());
                    d = d.replace("[class]", $("#me-addsp-class").val());
                    $("#me-addsp-label").val("");
                    $("#me-addsp-path").val("");
                    $("#me-addsp-class").val("");
                    $("#me-addsp-title").val("")
                }
            }
        }
        g = g.replace("[attributes]", c);
        g = g.replace("[editTemplate]", d);
        var b = $(".tab-pane.active")[0].id.replace("me-tab-", "");
        $("#me-menu-" + b + " ol:first-child").append(g);
        $("#me-menu-" + b + " ol:first-child li:last").fadeIn(700)
    });
    
    $(".tab-content").on("click", "button.me-deleteitem", function (c) {
        c.preventDefault();
        var b = $(this).parent().parent();
        if ($(b).find("ol:first").length >= 1) {
            bootbox.confirm(trans_deleteWithSubmenus, function (d) {
                if (true === d) {
                    a(b)
                }
            })
        } else {
            a(b)
        }
    });

    function a(c) {
        var b = $(c).parent("ol");
        b = b[0];
        $(c).remove();
        if ($(b).find("li").length == 0 && !$(b).hasClass("me-menulist")) {
            $(b).parent().find("> button").each(function () {
                this.remove()
            });
            b.remove()
        }
    }
    
    $(".tab-content").on("click", "button.me-updateitem", function () {
        var b = $(this).parent("div").parent();
        $(this).parent("div").find("input").each(function () {
            var c = $(this).data("tag");
            if (c != undefined) {
                $(b).attr("data-" + c, $(this).val());
                if (c == "label") {
                    var d = $(b).children(".dd3-content").first();
                    if ($(this).val() == "") {
                        $(d).html("<em>" + trans_nolabelset + "</em>")
                    } else {
                        $(d).html($(this).val())
                    }
                }
            }
        });
        $("div.dd-editpanel").addClass("hidden")
    });
    
    $(".revert-changes").click(function (b) {
        b.preventDefault();
        bootbox.confirm(trans_revertChanges, function (c) {
            if (true === c) {
                location.reload(true)
            }
        })
    });
    
    $(".restoremenus").on("click", function (c) {
        c.preventDefault();
        var b = $(this).data("filetime");
        bootbox.confirm(trans_restorebackup, function (d) {
            if (true === d) {
                restoreBackup(b)
            }
        })
    });
    
    $("#savemenus").click(function () {
        if (me_writeLock == 0) {
            return false
        }
        var b = {};
        $(".me-menu").each(function () {
            var d = [];
            $(this).children("ol").children("li").each(function () {
                d.push(extractMenuItem(this))
            });
            var c = $(this).data("menuname");
            b[c] = d
        });
        $.ajax({
            url: "",
            type: "POST",
            data: {
                menus: b,
                writeLock: me_writeLock
            },
            dataType: "json",
            error: function (c) {
                bootbox.alert(trans_connectionError, function () {})
            },
            success: function (c) {
                if (typeof c.writeLock != "undefined") {
                    me_writeLock = c.writeLock
                }
                if (c.status == 0) {
                    location.reload(true)
                }
                if (c.status == 1) {
                    bootbox.alert(trans_writeLockError, function () {})
                }
                if (c.status == 2 || c.status == 4) {
                    bootbox.alert(trans_parseError, function () {})
                }
                if (c.status == 3) {
                    bootbox.alert(trans_writeError, function () {})
                }
                if (c.status == 5) {
                    bootbox.alert(trans_backupFailError, function () {})
                }
            }
        })
    })
});

function extractMenuItem(d) {
    var c = {};
    $.each(d.attributes, function () {
        if (match = this.name.match(/^data-([a-z]+)/)) {
            if (this.value != "" || match[1] == "label") {
                c[match[1]] = this.value
            }
        }
    });
    var b = $("> ol > li", d);
    if (b.length > 0) {
        var a = [];
        b.each(function () {
            a.push(extractMenuItem(this))
        });
        c.submenu = a
    }
    return c
}

function restoreBackup(a) {
    $.ajax({
        url: "",
        type: "POST",
        data: {
            filetime: a
        },
        dataType: "json",
        error: function (b) {
            bootbox.alert(trans_connectionError, function () {})
        },
        success: function (b) {
            if (b.status == 0) {
                location.reload(true)
            } else {
                bootbox.alert(trans_backupRestoreFailError + " " + b.error, function () {})
            }
        }
    })
};