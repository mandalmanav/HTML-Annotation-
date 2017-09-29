(function ( $ ) {
 
    $.fn.annotate = function() {
    // create a parent svg tag
    var svgTag=$('<svg width="500" height="400" class="svgContainer"/>');
    var svgns = "http://www.w3.org/2000/svg";
    var button0 = $('<button id="button0" value="0" class="toolButton" />'); 
    var button1 = $('<button id="button0" value="1" class="toolButton" />'); 
    var button2 = $('<button id="button0" value="2" class="toolButton" />'); 
    var button3 = $('<button id="button0" value="3" class="toolButton" />'); 
    

    var currentElement = {};
    // toolId are 0 for none , 1 for line , 2 for rectangle , 3 for circle
    var tool=2,clientX1=0,clientX2=0,clientY1=0,clientY2=0,
    isDragging=false,elementIsActive=false,annotations=[],
    stroke="blue",strokeWidth="2px",fill="transparent",
    dragX1=0,dragX2=0,dragY1=0,dragY2=0;
    svgTag.attr({
                  height:this.height(),
                  width:this.width(),
                })
           .css({
           			position:"absolute",
           			top:0,
                left:0,
                'z-index':0
           			})

    svgTag.on('changeTool',function(newTool,val){
      if (tool == val){
        tool=0;
      }
      else{
        tool = val
      }
    })
    this.append(svgTag)
    var cont=svgTag[0]
    
    this.on('mousedown',function(event){
     
        clientX1 = clientX2 = dragX1 = event.offsetX;
        clientY1 = clientY2 = dragY1 = event.offsetY;
        console.log(clientX1,clientY1)
        radius = 0;
        isDragging = true;
        shapeIsDrawn = false
        draw();
    })
    this.on('mousemove',function(event){
      
      if(isDragging && !elementIsActive){
        shapeIsDrawn=true
        editShape(event.offsetX,event.offsetY)
      }
      else if(elementIsActive){
        element=document.querySelector(".annotationIsSelected");
        if(element.tagName === "circle"){
        element.setAttributeNS(null, 'cx', Number(element.getAttribute('cx'))+(event.offsetX - dragX1));
        element.setAttributeNS(null, 'cy', Number(element.getAttribute('cy'))+(event.offsetY - dragY1));
        
        }
        else if(element.tagName === "line"){
        element.setAttributeNS(null, 'x1', Number(element.getAttribute('x1'))+(event.offsetX - dragX1));
        element.setAttributeNS(null, 'y1', Number(element.getAttribute('y1'))+(event.offsetY - dragY1));
        element.setAttributeNS(null, 'x2', Number(element.getAttribute('x2'))+(event.offsetX - dragX1));
        element.setAttributeNS(null, 'y2', Number(element.getAttribute('y2'))+(event.offsetY - dragY1));
       
        }
        else{
        element.setAttributeNS(null, 'x', Number(element.getAttribute('x'))+(event.offsetX - dragX1));
        element.setAttributeNS(null, 'y', Number(element.getAttribute('y'))+(event.offsetY - dragY1));
         
        }
       dragX1 = event.offsetX;
        dragY1 = event.offsetY;
        console.log(Number(element.getAttribute('x'))+(1))
      }
    })
    this.on('mouseup',function(event){
      elementIsActive = false
        if(!shapeIsDrawn )
        {
          elementIsActive = false;
          $(currentElement).off('mouseup').off('mousedown').off('mousemove').remove
          currentElement.remove();
          return
        }

        elementIsActive = false
        isDragging=false;
        clientX2 = event.offsetX;
        clientY2 = event.offsetY;
        setEventListener();
        })
   var setEventListener = function(){
    $(currentElement).on('mousedown',function(event){

        $(event.target).toggleClass('annotationIsSelected');
        elementIsActive=true;
        });
    $(currentElement).on('mouseup',function(event){

        $(event.target).toggleClass('annotationIsSelected');
        elementIsActive=true;
        });

   };
   var editShape = function(clientX2,clientY2){
    if(tool === 1){
       currentElement.setAttributeNS(null, 'x2', clientX2);
       currentElement.setAttributeNS(null, 'y2', clientY2);
    }
    else if(tool === 2){
      if(clientY2 > clientY1) 
      {
        //bottom quadrant
        if(clientX2 > clientX1){
                  //right bottom quadrant
                 currentElement.setAttributeNS(null, 'width', clientX2 - clientX1);
                 currentElement.setAttributeNS(null, 'height',clientY2 - clientY1);
            }
        else{
                  //left bottom qaudrant
                currentElement.setAttributeNS(null, 'x', clientX2);
                currentElement.setAttributeNS(null, 'y', clientY1);
                currentElement.setAttributeNS(null, 'width', clientX1-clientX2);
                currentElement.setAttributeNS(null, 'height', clientY2-clientY1);  
        }
      }
      
      else {
        // top quadrant
       if(clientX2 > clientX1){
        //top right quadrant
                currentElement.setAttributeNS(null, 'x', clientX1);
                currentElement.setAttributeNS(null, 'y', clientY2);
                currentElement.setAttributeNS(null, 'width', clientX2-clientX1);
                currentElement.setAttributeNS(null, 'height', clientY1-clientY2); 
       }
       else{
        // top left quadrant
          currentElement.setAttributeNS(null, 'x', clientX2);
          currentElement.setAttributeNS(null, 'y', clientY2);
          currentElement.setAttributeNS(null, 'width', clientX1-clientX2);
          currentElement.setAttributeNS(null, 'height', clientY1-clientY2);
       }
      }
    
    }
    else if(tool === 3){
      currentElement.setAttributeNS(null, 'r', Math.sqrt(Math.pow((clientX2-clientX1),2)+Math.pow((clientY2-clientY1),2)));
    }
   }; 
   var addAnnotation = function(){
     annotations.push({
                      clientX1:clientX1,
                      clientY1:clientY1,
                      clientX2:clientX2,
                      clientY2:clientY2,
                      shape:1,
                      strokeWidth:strokeWidth,
                      fill:fill
                    })
   };
   var draw = function(){
      if( tool === 0 ){
        return
      }
      else if( tool === 1 ){
        //tool is line
        drawShape.line(clientX1,clientY1,clientX2,clientY2,stroke,fill,strokeWidth)
      }
      else if( tool === 2 ){
        //tool is rectangle
        drawShape.rectangle(clientX1,clientY1,clientY2-clientY1,clientX2-clientX1,stroke,fill,strokeWidth)
      } 
      else if( tool === 3 ){
        //tool is circle
        drawShape.circle(clientX1,clientY1,radius,stroke,fill,strokeWidth)
      }
   } ;
   var annotate= function(){

   };
   var drawShape= 
   							{
   										rectangle:function(x,y,height,width,stroke,fill,strokeWidth){
                                 
                                var rect = currentElement = document.createElementNS(svgns, 'rect');
                                rect.setAttributeNS(null, 'x', x);
                                rect.setAttributeNS(null, 'y', y);
                                rect.setAttributeNS(null, 'height', height);
                                rect.setAttributeNS(null, 'width', width);
                                rect.setAttributeNS(null, 'style', 'z-index:2;fill:'+fill+'; stroke: '+stroke+';stroke-width:'+strokeWidth );
                                cont.appendChild(rect);
                                
                      			},

                        circle:function(x,y,radius,stroke,fill,strokeWidth)  {
                                var circle = currentElement  = document.createElementNS(svgns, 'circle');
                                circle.setAttributeNS(null, 'cx', x);
                                circle.setAttributeNS(null, 'cy', y);
                                circle.setAttributeNS(null, 'r', radius);
                                circle.setAttributeNS(null, 'style', 'z-index:2;fill:'+fill+'; stroke: '+stroke+';stroke-width:'+strokeWidth);
                                cont.appendChild(circle);
                        },
                        line:function(x1,y1,x2,y2,stroke,fill,strokeWidth){
                                var line = currentElement  = document.createElementNS(svgns,'line');
                                line.setAttributeNS(null, 'x1', x1);
                                line.setAttributeNS(null, 'x2', x2);
                                line.setAttributeNS(null, 'y1', y1);
                                line.setAttributeNS(null, 'y2', y2);
                                line.setAttributeNS(null, 'style', 'z-index:2;fill:'+fill+'; stroke: '+stroke+';stroke-width:'+strokeWidth);
                                cont.appendChild(line) 
                        }

   							}
   //  drawShape.rectangle(200,200,50,50,"blue","transparent","2px");
   //  drawShape.circle(150,150,100,"blue","transparent","2px");
   //  drawShape.line(50,50,250,250,"blue","transparent","2px")
   // //     this.css( "color", "green" );
     //   return this;
    };
 
}( jQuery ));
