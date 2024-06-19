//页面元素操纵函数
//displayMessage1();

function displayMessage1(){
    alert("OK");
}

function hide(){
    //台风div显示与消失
    let element = document.querySelector('.tfDiv');
    if (element.style.display === 'none') {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
    //alert("成功");
}
function hide1(img){
    img.style.display = 'none';
}
function hideTFContainer() {
    //动画隐藏图例元素
    $("#tuliCoverLayer").hide("slow");
    $(".closeDivTF").hide("slow");
    $(".tuliContent").hide("slow");
}
function showTFContainer() {
    //动画显示图例元素
    $("#tuliCoverLayer").show("slow");
    $(".closeDivTF").show("slow");
    $(".tuliContent").show("slow");
}
function tuli(){
    //如果图例显示则隐藏反之亦然
    if ($(".tuliContent").is(":hidden")){
        // alert("111");
        showTFContainer();
    }
    else{
        hideTFContainer();
    }
}
function hideTfDiv(){
    //如果目录与图片显示则隐藏，反之亦然
    if ($(".tfRightDiv").is(":hidden")){
        // alert("111");
        $(".tfRightDiv").show("slow");
        $('.right').animate({
            left: '-=360px'
        }, 600, function() {
            // 动画结束后，更改图片的src属性
            $(this).attr('src', '/images/other/导航1.png');
        });
        $('.topright').animate({
            left: '-=360px'
        }, 600,);
    }
    else{
        $(".tfRightDiv").hide("slow");
        $('.right').animate({
            left: '+=360px'
        }, 600, function() {
            // 动画结束后，更改图片的src属性
            $(this).attr('src', '/images/other/导航.png');
        });
        $('.topright').animate({
            left: '+=360px'
        }, 600,);
    }
}
function moveTfdivLeft() {
    //移动台风目录但未移动图片，示例用
    if($('.tfRightDiv').css('opacity') == 0){
        $('.tfRightDiv').animate({
            left: '-=300px',
            opacity: 1,
        }, 500); // 500毫秒 = 0.5秒
        let element = document.querySelector('.tfRightDiv');
        if (element.style.display === 'none') {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    }else{
        $('.tfRightDiv').animate({
            left: '+=300px',
            opacity: 0,
        }, 500); // 500毫秒 = 0.5秒
    }
}
function  tuliMove(){
    var draggable = document.querySelector('.tuliDiv');

    // 鼠标按下时的位置
    var initialX, initialY;
    // 标记是否正在拖动
    var isDragging = false;

    // 添加mousedown事件监听器
    draggable.addEventListener('mousedown', function(e) {
        // 防止默认行为（例如文本选择）
        e.preventDefault();

        // 记录鼠标按下时的位置
        initialX = e.clientX - draggable.getBoundingClientRect().left;
        initialY = e.clientY - draggable.getBoundingClientRect().top;

        // 标记为正在拖动
        isDragging = true;

        // 添加mousemove事件监听器以更新元素位置
        document.addEventListener('mousemove', updatePosition);

        // 当鼠标释放或离开元素时，停止拖动
        function stopDragging(e) {
            if (e.type === 'mouseup' || e.type === 'mouseleave') {
                isDragging = false;
                document.removeEventListener('mousemove', updatePosition);
                // 如果需要，也可以在这里添加mouseleave的处理逻辑
            }
        }

        // 为document添加mouseup和mouseleave事件监听器
        document.addEventListener('mouseup', stopDragging);
        draggable.addEventListener('mouseleave', stopDragging);
    });

    // 更新元素位置的函数
    function updatePosition(e) {
        if (!isDragging) return;

        // 更新元素位置
        var x = e.clientX - initialX;
        var y = e.clientY - initialY;

        // 更新元素的left和top样式
        draggable.style.left = x + 'px';
        draggable.style.top = y + 'px';
    }
}