    /**
    * o------------------------------------------------------------------------------o
    * | This file is part of the RGraph package - you can learn more at:             |
    * |                                                                              |
    * |                          http://www.rgraph.net                               |
    * |                                                                              |
    * | This package is licensed under the RGraph license. For all kinds of business |
    * | purposes there is a small one-time licensing fee to pay and for personal,    |
    * | charity and educational purposes it is free to use. You can read the full    |
    * | license here:                                                                |
    * |                      http://www.rgraph.net/LICENSE.txt                       |
    * o------------------------------------------------------------------------------o
    */
    
    if (typeof(RGraph) == 'undefined') RGraph = {};

    /**
    * The progress bar constructor
    * 
    * @param int id    The ID of the canvas tag
    * @param int value The indicated value of the meter.
    * @param int max   The end value (the upper most) of the meter
    */
    RGraph.Progress = function (id, value, max)
    {
        this.id      = id;
        this.canvas  = document.getElementById(id);
        this.context = this.canvas.getContext('2d');
        this.canvas.__object__ = this;
        this.type              = 'progress';
        this.coords            = [];


        /**
        * Opera compatibility
        */
        RGraph.OperaCompat(this.context);

        
        this.properties = new Array();
        this.properties['chart.max']              = max;
        this.properties['chart.value']            = value;
        this.properties['chart.color']            = '#0c0';
        this.properties['chart.tickmarks']        = true;
        this.properties['chart.tickmarks.color']  = 'black';
        this.properties['chart.gutter']           = 25;
        this.properties['chart.numticks']         = 10;
        this.properties['chart.orientation']      = 'horizontal';
        this.properties['chart.background.color'] = '#eee';
        this.properties['chart.shadow']           = false;
        this.properties['chart.shadow.color']     = 'rgba(0,0,0,0.5)';
        this.properties['chart.shadow.blur']      = 3;
        this.properties['chart.shadow.offsetx']   = 3;
        this.properties['chart.shadow.offsety']   = 3;
        this.properties['chart.title']            = '';
        this.properties['chart.title.vpos']       = null;
        this.properties['chart.width']            = 0;
        this.properties['chart.height']           = 0;
        this.properties['chart.text.size']        = 10;
        this.properties['chart.text.color']       = 'black';
        this.properties['chart.text.font']        = 'Verdana';
        this.properties['chart.contextmenu']      = null;
        this.properties['chart.units.pre']        = '';
        this.properties['chart.units.post']       = '';
        this.properties['chart.tooltips']         = [];
        this.properties['chart.tooltip.effect']   = 'fade';
        this.properties['chart.annotatable']      = false;
        this.properties['chart.annotate.color']   = 'black';
        this.properties['chart.zoom.factor']      = 1.5;
        this.properties['chart.zoom.fade.in']     = true;
        this.properties['chart.zoom.fade.out']    = true;
        this.properties['chart.zoom.hdir']        = 'right';
        this.properties['chart.zoom.vdir']        = 'down';
        this.properties['chart.zoom.frames']      = 10;
        this.properties['chart.zoom.delay']       = 50;
        this.properties['chart.zoom.shadow']      = true;

        // Check for support
        if (!this.canvas) {
            alert('[PROGRESS] No canvas support');
            return;
        }

        // Check the common library has been included
        if (typeof(RGraph) == 'undefined') {
            alert('[PROGRESS] Fatal error: The common library does not appear to have been included');
        }
    }


    /**
    * A generic setter
    * 
    * @param string name  The name of the property to set
    * @param string value The value of the poperty
    */
    RGraph.Progress.prototype.Set = function (name, value)
    {
        this.properties[name.toLowerCase()] = value;
    }


    /**
    * A generic getter
    * 
    * @param string name  The name of the property to get
    */
    RGraph.Progress.prototype.Get = function (name)
    {
        return this.properties[name.toLowerCase()];
    }


    /**
    * Draws the progress bar
    */
    RGraph.Progress.prototype.Draw = function ()
    {
        // Figure out the width and height
        this.width  = this.canvas.width - (2 * this.Get('chart.gutter'));
        this.height = this.canvas.height - (2 * this.Get('chart.gutter'));
        this.coords = [];

        this.Drawbar();
        this.DrawTickMarks();
        this.DrawLabels();

        this.context.stroke();
        this.context.fill();

        /**
        * Setup the context menu if required
        */
        RGraph.ShowContext(this);
        
        /**
        * Alternatively, show the tooltip if requested
        */
        if (this.Get('chart.tooltips').length) {

            // Need to register this object for redrawing
            RGraph.Register(this);

            /**
            * Install the window onclick handler
            */
            window.onclick = function ()
            {
                RGraph.Redraw();
            }


            /**
            * Install the onclick event handler for the tooltips
            */
            this.canvas.onclick = function (e)
            {
                e = RGraph.FixEventObject(document.all ? event : e);

                var canvas = document.getElementById(this.id);
                var obj = canvas.__object__;

                /**
                * Redraw the graph first, in effect resetting the graph to as it was when it was first drawn
                * This "deselects" any already selected bar
                */
                RGraph.Redraw();
    
                /**
                * Get the mouse X/Y coordinates
                */
                var mouseCoords = RGraph.getMouseXY(e);

                /**
                * Loop through the bars determining if the mouse is over a bar
                */
                for (var i=0; i<obj.coords.length; i++) {

                    var mouseX = mouseCoords[0];  // In relation to the canvas
                    var mouseY = mouseCoords[1];  // In relation to the canvas
                    var left   = obj.coords[i][0];
                    var top    = obj.coords[i][1];
                    var width  = obj.coords[i][2];
                    var height = obj.coords[i][3];

                    if (mouseX >= left && mouseX <= (left + width) && mouseY >= top && mouseY <= (top + height) ) {
                        
                        obj.context.beginPath();
                        obj.context.strokeStyle = '#000';
                        obj.context.fillStyle   = 'rgba(255,255,255,0.5)';
                        obj.context.strokeRect(left, top, width, height);
                        obj.context.fillRect(left, top, width, height);
    
                        obj.context.stroke();
                        obj.context.fill();
    
                        /**
                        * Show a tooltip if it's defined
                        */
                        if (obj.Get('chart.tooltips')[i]) {
                            RGraph.Tooltip(canvas, obj.Get('chart.tooltips')[i], e.pageX, e.pageY);
                        }
                    }
                }

                /**
                * Stop the event bubbling
                */
                e.stopPropagation = true;
                e.cancelBubble = true;
            }

            /**
            * If the cursor is over a hotspot, change the cursor to a hand
            */
            this.canvas.onmousemove = function (e)
            {
                e = RGraph.FixEventObject(document.all ? event : e);

                var canvas = document.getElementById(this.id);
                var obj = canvas.__object__;

                /**
                * Get the mouse X/Y coordinates
                */
                var mouseCoords = RGraph.getMouseXY(e);

                /**
                * Loop through the bars determining if the mouse is over a bar
                */
                for (var i=0; i<obj.coords.length; i++) {

                    var mouseX = mouseCoords[0];  // In relation to the canvas
                    var mouseY = mouseCoords[1];  // In relation to the canvas
                    var left   = obj.coords[i][0];
                    var top    = obj.coords[i][1];
                    var width  = obj.coords[i][2];
                    var height = obj.coords[i][3];

                    if (mouseX >= left && mouseX <= (left + width) && mouseY >= top && mouseY <= (top + height) ) {
                        canvas.style.cursor = document.all ? 'hand' : 'pointer';
                        break;
                    }
                    
                    canvas.style.cursor = null;
                }
            }

        // This resets the canvas events - getting rid of any installed event handlers
        } else {
            this.canvas.onclick     = null;
            this.canvas.onmousemove = null;
        }
        
        /**
        * If the canvas is annotatable, do install the event handlers
        */
        RGraph.Annotate(this);
        
        /**
        * This bit shows the mini zoom window if requested
        */
        RGraph.ShowZoomWindow(this);
    }

    /**
    * 
    */
    RGraph.Progress.prototype.Drawbar = function ()
    {
        // Set a shadow if requested
        if (this.Get('chart.shadow')) {
            this.context.shadowColor   = this.Get('chart.shadow.color');
            this.context.shadowBlur    = this.Get('chart.shadow.blur');
            this.context.shadowOffsetX = this.Get('chart.shadow.offsetx');
            this.context.shadowOffsetY = this.Get('chart.shadow.offsety');
        }

        // Draw the outline
        this.context.fillStyle   = this.Get('chart.background.color');
        this.context.strokeStyle = 'black';
        this.context.strokeRect(this.Get('chart.gutter'), this.Get('chart.gutter'), this.width, this.height);
        this.context.fillRect(this.Get('chart.gutter'), this.Get('chart.gutter'), this.width, this.height);

        // Turn off any shadow
        this.context.shadowColor = 'rgba(0,0,0,0)';
        this.context.shadowBlur    = 0;
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;

        this.context.fillStyle   = this.Get('chart.color');
        this.context.strokeStyle = 'black';

        // Draw the actual bar itself
        if (this.Get('chart.orientation') == 'horizontal') {
            var barWidth = Math.min(this.width, (this.Get('chart.value') / this.Get('chart.max')) * this.width);
            this.context.strokeRect(this.Get('chart.gutter'), this.Get('chart.gutter'), barWidth, this.height);
            this.context.fillRect(this.Get('chart.gutter'), this.Get('chart.gutter'), barWidth, this.height);
            
            // Store the coords
            this.coords.push([this.Get('chart.gutter'), this.Get('chart.gutter'), barWidth, this.height]);

        } else {

            var barHeight = Math.min(this.height, (this.Get('chart.value') / this.Get('chart.max')) * this.height);
            this.context.strokeRect(this.Get('chart.gutter'), this.Get('chart.gutter') + this.height - barHeight, this.width, barHeight);
            this.context.fillRect(this.Get('chart.gutter'), this.Get('chart.gutter') + this.height - barHeight, this.width, barHeight);

            // Store the coords
            this.coords.push([this.Get('chart.gutter'), this.Get('chart.gutter') + this.height - barHeight, this.width, barHeight]);
        }
    }

    /**
    * The function that draws the tick marks. Apt name...
    */
    RGraph.Progress.prototype.DrawTickMarks = function ()
    {
        this.context.strokeStyle = this.Get('chart.tickmarks.color');

        if (this.Get('chart.tickmarks') && this.Get('chart.orientation') == 'horizontal') {

            // This is used by the label function below
            this.tickInterval = this.width / this.Get('chart.numticks');
    
            for (var i=this.Get('chart.gutter') + this.tickInterval; i<=(this.width + this.Get('chart.gutter')); i+=this.tickInterval) {
                this.context.moveTo(i, this.Get('chart.gutter') + this.height);
                this.context.lineTo(i, this.Get('chart.gutter') + this.height + 4);
            }
        
        } else if (this.Get('chart.tickmarks') && this.Get('chart.orientation') == 'vertical') {
        
            this.tickInterval = this.height / this.Get('chart.numticks');

            for (var i=this.Get('chart.gutter'); i<=(this.canvas.height - this.Get('chart.gutter') - this.tickInterval); i+=this.tickInterval) {
                this.context.moveTo(this.canvas.width - this.Get('chart.gutter'), i);
                this.context.lineTo(this.canvas.width - this.Get('chart.gutter') + 4, i);
            }
        }

        this.context.stroke();
    }


    /**
    * The function that draws the labels
    */
    RGraph.Progress.prototype.DrawLabels = function ()
    {
        this.context.fillStyle = this.Get('chart.text.color');

        var xPoints = [];
        var yPoints = [];

        if (this.Get('chart.orientation') == 'horizontal') {
            for (i=this.Get('chart.gutter') + this.tickInterval; i <= (this.Get('chart.gutter') + this.width); i+= this.tickInterval) {
                xPoints.push(i);
                yPoints.push(this.Get('chart.gutter') + this.height + 4);
            }

            var xAlignment = 'center';
            var yAlignment = 'top';

            this.context.beginPath();
            for (i=0; i<xPoints.length; ++i) {

                RGraph.Text(this.context,
                            this.Get('chart.text.font'),
                            this.Get('chart.text.size'),
                            xPoints[i],
                            yPoints[i],
                            this.Get('chart.units.pre') + String( parseInt( (this.Get('chart.max') / xPoints.length) * (i + 1) )) + this.Get('chart.units.post'),
                            yAlignment,
                            xAlignment);

            }

        } else {

            for (i=this.Get('chart.gutter'); i < (this.canvas.height - this.tickInterval); i+= this.tickInterval) {
                xPoints.push(this.canvas.width - this.Get('chart.gutter') + 4);
                yPoints.push(i);
            }

            var xAlignment = 'left';
            var yAlignment = 'center';

            for (i=0; i<xPoints.length; ++i) {
                RGraph.Text(this.context,
                            this.Get('chart.text.font'),
                            this.Get('chart.text.size'),
                            xPoints[i],
                            yPoints[i],
                            this.Get('chart.units.pre') + String( this.Get('chart.max') - parseInt( (this.Get('chart.max') / yPoints.length) * i)) + this.Get('chart.units.post'),
                            yAlignment,
                            xAlignment);
            }
        }

        // Draw the title text
        if (this.Get('chart.title')) {
            RGraph.DrawTitle(this.canvas, this.Get('chart.title'), this.Get('chart.gutter'), 0, this.Get('chart.text.size') + 2);
        }
    }