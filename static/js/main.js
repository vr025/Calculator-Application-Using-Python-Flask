$(document).ready(function() {
    var num2 = $('#num2');
    var num1 = $('#num1');
    var temp = $('#temp');
	var display = $('.caltop');
    var op = $('#operator');
	
    var clearData = function() {

        num1.val('');
        op.val('');
        num2.val('');
        temp.val('');
    };
	
	
	 $('.eq').click(function() {
		
        if (display.html() === '' || ('+-*/').indexOf(display.html()) != -1) return ;
        num2.val(display.html());
        
        $.post('/operation', {
            number1: num1.val(),
            operator: op.val(),
            number2: num2.val()
        }, function(data) {
            display.html(data.result);
            clearData();
			temp.val(data.result);
        });
    });
	
	
    var clearOutput = function() {
        display.html('');
    };
	
    $('.num').click(function() {
		
		if(temp.val()!=''){
			display.html('');
			
		}
        if (('+-*/').indexOf(display.html()) != -1) {
            display.html('');
        }

        if ($(this).val() == '.' && (display.html()).indexOf('.') != -1) return ;
        if (display.html() == '0') {
            clearOutput()
        }

        if (temp.val() !== '') {
            clearOutput()
            clearData();
        }

        display.append($(this).val());
		
    });

    $('.clear').click(function() {	
        display.html('0');
        clearData();
    });

    $('.oprd').click(function() {
		
        var op_new = $(this).val();
        if (num1.val() !== '' &&  ('+-*/').indexOf(num1.val()) == -1 && op.val() !== '') {
            num2.val(display.html());
            if (('+-*/').indexOf(num2.val()) != -1) return ;
            $.post('/operation', {
                number1: num1.val(),
                operator: op.val(),
                number2: num2.val()
            }, function(data) {
                display.html(op_new);
                num1.val(data.result);
                op.val(op_new);
            });
        } else {
            num1.val(display.html());
            op.val(op_new);
            display.html(op_new);
        }
    });

   
});