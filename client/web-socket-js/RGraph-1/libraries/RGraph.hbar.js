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
    * The horizontal bar chart constructor. The horizontal bar is a minor variant
    * on the bar chart. If you have big labels, this may be useful as there is usually
    * more space available for them.
    * 
    * @param object canvas The canvas object
    * @param array  data   The chart data
    */
    RGraph.HBar = function (id, data)
    {
        // Get the canvas and context objects
        this.id                = id;
        this.canvas            = document.getElementById(id);
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.canvas.__object__ = this;
        this.data              = data;
        this.type              = 'hbar';
        this.coords            = [];
        this.properties        = [];


        /**
        * Opera compatibility
        */
        RGraph.OperaCompat(this.context);

        
        this.max = 0;
        this.stackedOrGrouped  = false;

        // Default properties
        this.properties['chart.gutter']                 = 25;
        this.properties['chart.background.grid']        = true;
        this.properties['chart.background.grid.color']  = '#ddd';
        this.properties['chart.background.grid.width']  = 1;
        this.properties['chart.background.grid.hsize']  = 25;
        this.properties['chart.background.grid.vsize']  = 25;
        this.properties['chart.background.barcolor1']   = 'white';
        this.properties['chart.background.barcolor2']   = 'white';
        this.properties['chart.background.grid.hlines'] = true;
        this.properties['chart.background.grid.vlines'] = true;
        this.properties['chart.background.grid.border'] = true;
        this.properties['chart.title']                  = '';
        this.properties['chart.title.vpos']             = null;
        this.properties['chart.text.size']              = 10;
        this.properties['chart.text.color']             = 'black';
        this.properties['chart.text.font']              = 'Verdana';
        this.properties['chart.colors']                 = ['rgb(0,0,255)', '#0f0', '#00f', '#ff0', '#0ff', '#0f0'];
        this.properties['chart.labels']                 = [];
        this.properties['chart.labels.above']           = false;
        this.properties['chart.contextmenu']            = null;
        this.properties['chart.key']                    = [];
        this.properties['chart.key.background']         = 'white';
        this.properties['chart.key.position']           = 'graph';
        this.properties['chart.units.pre']              = '';
        this.properties['chart.units.post']             = '';
        this.properties['chart.strokecolor']            = 'black';
        this.properties['chart.xmax']                   = 0;
        this.properties['chart.axis.color']             = 'black';
        this.properties['chart.shadow']                 = false;
        this.properties['chart.shadow.color']           = '#666';
        this.properties['chart.shadow.blur']            = 3;
        this.properties['chart.shadow.offsetx']         = 3;
        this.properties['chart.shadow.offsety']         = 3;
        this.properties['chart.vmargin']                = 3;
        this.properties['chart.grouping']               = 'grouped';
        this.properties['chart.tooltips']               = [];
        this.properties['chart.tooltip.effect']         = 'fade';
        this.properties['chart.annotatable']            = false;
        this.properties['chart.annotate.color']         = 'black';
        this.properties['chart.zoom.factor']            = 1.5;
        this.properties['chart.zoom.fade.in']           = true;
        this.properties['chart.zoom.fade.out']          = true;
        this.properties['chart.zoom.hdir']              = 'right';
        this.properties['chart.zoom.vdir']              = 'down';
        this.properties['chart.zoom.frames']            = 10;
        this.properties['chart.zoom.delay']             = 50;
        this.properties['chart.zoom.shadow']            = true;
        this.properties['chart.zoom.mode']              = 'canvas';
        this.properties['chart.zoom.thumbnail.width']   = 75;
        this.properties['chart.zoom.thumbnail.height']  = 75;

        // Check for support
        if (!this.canvas) {
            alert('[HBAR] No canvas support');
            return;
        }
        
        // Check the canvasText library has been included
        if (typeof(RGraph) == 'undefined') {
            alert('[HBAR] Fatal error: The common library does not appear to have been included');
        }

        for (i=0; i<this.data.length; ++i) {
            if (typeof(this.data[i]) == 'object') {
                this.stackedOrGrouped = true;
            }
        }
    }


    /**
    * A setter
    * 
    * @param name  string The name of the property to set
    * @param value mixed  The value of the property
    */
    RGraph.HBar.prototype.Set = function (name, value)
    {
        if (name == 'chart.labels.abovebar') {
            name = 'chart.labels.above';
        }

        this.properties[name.toLowerCase()] = value;
    }


    /**
    * A getter
    * 
    * @param name  string The name of the property to get
    */
    RGraph.HBar.prototype.Get = function (name)
    {
        if (name == 'chart.labels.abovebar') {
            name = 'chart.labels.above';
        }

        return this.properties[name];
    }


    /**
    * The function you call to draw the bar chart
    */
    RGraph.HBar.prototype.Draw = function ()
    {
        var gutter = this.Get('chart.gutter');

        /**
        * Stop the coords array from growing uncontrollably
        */
        this.coords = [];

        /**
        * Work out a few things. They need to be here because they depend on things you can change before you
        * call Draw() but after you instantiate the object
        */
        this.graphwidth     = this.canvas.width - ( (4 * gutter));
        this.graphheight    = this.canvas.height - (2 * gutter);
        this.halfgrapharea  = this.grapharea / 2;
        this.halfTextHeight = this.Get('chart.text.size') / 2;
        this.lgutter = 3 * gutter;

        // Progressively Draw the chart
        this.DrawBackground();

        this.Drawbars();
        this.DrawAxes();
        this.DrawLabels();


        // Draw the key if necessary
        if (this.Get('chart.key').length) {
            RGraph.DrawKey(this, this.Get('chart.key'), this.Get('chart.colors'));
        }

        /**
        * Install the event handlers for tooltips
        */
        if (this.Get('chart.tooltips').length > 0) {

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
                for (var i=0,len=obj.coords.length; i<len; i++) {

                    var mouseX = mouseCoords[0];  // In relation to the canvas
                    var mouseY = mouseCoords[1];  // In relation to the canvas
                    var left   = obj.coords[i][0];
                    var top    = obj.coords[i][1];
                    var width  = obj.coords[i][2];
                    var height = obj.coords[i][3];

                    if (mouseX >= (left) && mouseX <= (left + width) && mouseY >= top && mouseY <= (top + height) ) {
                        canvas.style.cursor = document.all ? 'hand' : 'pointer';
                        return;
                    }

                    canvas.style.cursor = null;
                }
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
                for (var i=0,len=obj.coords.length; i<len; i++) {

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
                        obj.context.strokeRect(left, top + obj.Get('chart.vmargin'), width, height - (2 * obj.Get('chart.vmargin')));
                        obj.context.fillRect(left, top + obj.Get('chart.vmargin'), width, height - (2 * obj.Get('chart.vmargin')));
    
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

            // This resets the bar graph
            if (RGraph.Registry.Get('chart.tooltip')) {
                RGraph.Registry.Get('chart.tooltip').style.display = 'none';
                RGraph.Registry.Set('chart.tooltip', null)
            }
        // This resets the canvas events - getting rid of any installed event handlers
        } else {
            this.canvas.onclick     = null;
            this.canvas.onmousemove = null;
        }

        /**
        * Setup the context menu if required
        */
        RGraph.ShowContext(this);


        /**
        * Draw "in graph" labels
        */
        RGraph.DrawInGraphLabels(this);
        
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
    * This draws the axes
    */
    RGraph.HBar.prototype.DrawAxes = function ()
    {
        var gutter  = this.Get('chart.gutter');
        var halfway = ((this.canvas.width - (4 * gutter)) / 2) + (3 * gutter);

        this.context.beginPath();
        this.context.lineWidth   = 1;
        this.context.strokeStyle = this.Get('chart.axis.color');

        // Draw the Y axis
        if (this.Get('chart.yaxispos') == 'center') {
            this.context.moveTo(halfway, gutter);
            this.context.lineTo(halfway, this.canvas.height - gutter);
        } else {
            this.context.moveTo(gutter * 3, gutter);
            this.context.lineTo(gutter * 3, this.canvas.height - gutter);
        }

        // Draw the X axis
        this.context.moveTo(gutter * 3, this.canvas.height - gutter);
        this.context.lineTo(this.canvas.width - gutter, this.canvas.height - gutter);

        // Draw the Y tickmarks
        var yTickGap = (this.canvas.height - (2 * gutter)) / this.data.length;

        for (y=gutter; y<(this.canvas.height - gutter); y+=yTickGap) {
            if (this.Get('chart.yaxispos') == 'center') {
                this.context.moveTo(halfway + 3, y);
                this.context.lineTo(halfway  - 3, y);
            } else {
                this.context.moveTo(gutter * 3, y);
                this.context.lineTo( (gutter * 3)  - 3, y);
            }
        }


        // Draw the X tickmarks
        xTickGap = (this.canvas.width - (4 * gutter) ) / 10;
        yStart   = this.canvas.height - gutter;
        yEnd     = (this.canvas.height - gutter) + 3;

        for (x=(this.canvas.width - gutter), i=0; this.Get('chart.yaxispos') == 'center' ? x>=(3 * gutter) : x>(3*gutter); x-=xTickGap) {

            if (this.Get('chart.yaxispos') != 'center' || i != 5) {
                this.context.moveTo(x, yStart);
                this.context.lineTo(x, yEnd);
            }
            i++;
        }

        this.context.stroke();
    }


    /**
    * This function draws the background. The common function isn't used because the left gutter is
    * three times as big.
    * 
    * @param  object obj The graph object
    */
    RGraph.HBar.prototype.DrawBackground = function ()
    {
        var gutter = this.Get('chart.gutter');

        this.context.beginPath();

        // Draw the horizontal bars
        this.context.fillStyle = this.Get('chart.background.barcolor1');
        for (var i=gutter; i < (this.canvas.height - gutter); i+=80) {
            this.context.fillRect (gutter * 3, i, this.canvas.width - (gutter * 4), Math.min(40, this.canvas.height - gutter - i) );
        }

        this.context.fillStyle = this.Get('chart.background.barcolor2');
        for (var i= (40 + gutter); i < (this.canvas.height - gutter); i+=80) {
            this.context.fillRect (gutter * 3, i, this.canvas.width - (gutter * 4), i + 40 > (this.canvas.height - this.Get('chart.gutter')) ? this.canvas.height - (gutter + i) : 40);
        }
        
        this.context.stroke();

        // Draw the background grid
        if (this.Get('chart.background.grid')) {

            this.context.beginPath();
            this.context.lineWidth   = this.Get('chart.background.grid.width');
            this.context.strokeStyle = this.Get('chart.background.grid.color');

            // Draw the horizontal lines
            if (this.Get('chart.background.grid.hlines')) {
                for (y=gutter; y < (this.canvas.height - gutter); y+=this.Get('chart.background.grid.hsize')) {
                    this.context.moveTo(gutter * 3, y);
                    this.context.lineTo(this.canvas.width - gutter, y);
                }
            }

            // Draw the vertical lines
            if (this.Get('chart.background.grid.vlines')) {
                for (x=gutter * 3; x <= (this.canvas.width - gutter); x+=this.Get('chart.background.grid.vsize')) {
                    this.context.moveTo(x, gutter);
                    this.context.lineTo(x, this.canvas.height - gutter);
                }
            }

            if (this.Get('chart.background.grid.border')) {
                // Make sure a rectangle, the same colour as the grid goes around the graph
                this.context.strokeStyle = this.Get('chart.background.grid.color');
                this.context.strokeRect(gutter * 3, gutter, this.canvas.width - (4 * gutter), this.canvas.height - (2 * gutter));
            }
        }
        
        this.context.stroke();

        // Draw the title if one is set
        if ( typeof(this.Get('chart.title')) == 'string') {
            
            RGraph.DrawTitle(this.canvas,
                             this.Get('chart.title'),
                             gutter,
                             (3 * gutter) + ((this.canvas.width - (4 * gutter)) / 2),
                             this.Get('chart.text.size') + 2);
        }
        
        this.context.stroke();
    }


    /**
    * This draws the labels for the graph
    */
    RGraph.HBar.prototype.DrawLabels = function ()
    {
        var gutter     = this.Get('chart.gutter');
        var context    = this.context;
        var canvas     = this.canvas;
        var units_pre  = this.Get('chart.units.pre');
        var units_post = this.Get('chart.units.post');
        var text_size  = this.Get('chart.text.size');
        var font       = this.Get('chart.text.font');

        /**
        * Draw the X axis labels
        */
        this.context.beginPath();
        this.context.fillStyle = this.Get('chart.text.color');

        //var interval = (this.canvas.width - (4 * gutter)) / (t ? 10 : 5);

        if (this.Get('chart.yaxispos') == 'center') {
            RGraph.Text(context, font, text_size, (gutter * 3) + (this.graphwidth * (10/10)), gutter + this.halfTextHeight + this.graphheight + 2, RGraph.number_format(this.scale[4], units_pre, units_post), 'center', 'center');
            RGraph.Text(context, font, text_size, (gutter * 3) + (this.graphwidth * (9/10)), gutter + this.halfTextHeight + this.graphheight + 2, RGraph.number_format(this.scale[3], units_pre, units_post), 'center', 'center');
            RGraph.Text(context, font, text_size, (gutter * 3) + (this.graphwidth * (8/10)), gutter + this.halfTextHeight + this.graphheight + 2, RGraph.number_format(this.scale[2], units_pre, units_post), 'center', 'center');
            RGraph.Text(context, font, text_size, (gutter * 3) + (this.graphwidth * (7/10)), gutter + this.halfTextHeight + this.graphheight + 2, RGraph.number_format(this.scale[1], units_pre, units_post), 'center', 'center');
            RGraph.Text(context, font, text_size, (gutter * 3) + (this.graphwidth * (6/10)), gutter + this.halfTextHeight + this.graphheight + 2, RGraph.number_format(this.scale[0], units_pre, units_post), 'center', 'center');
            
            RGraph.Text(context, font, text_size, (gutter * 3) + (this.graphwidth * (4/10)), gutter + this.halfTextHeight + this.graphheight + 2, RGraph.number_format(-1 * this.scale[0], units_pre, units_post), 'center', 'center');
            RGraph.Text(context, font, text_size, (gutter * 3) + (this.graphwidth * (3/10)), gutter + this.halfTextHeight + this.graphheight + 2, RGraph.number_format(-1 * this.scale[1], units_pre, units_post), 'center', 'center');
            RGraph.Text(context, font, text_size, (gutter * 3) + (this.graphwidth * (2/10)), gutter + this.halfTextHeight + this.graphheight + 2, RGraph.number_format(-1 * this.scale[2], units_pre, units_post), 'center', 'center');
            RGraph.Text(context, font, text_size, (gutter * 3) + (this.graphwidth * (1/10)), gutter + this.halfTextHeight + this.graphheight + 2, RGraph.number_format(-1 * this.scale[3], units_pre, units_post), 'center', 'center');
            RGraph.Text(context, font, text_size, (gutter * 3) + (this.graphwidth * (0)), gutter + this.halfTextHeight + this.graphheight + 2, RGraph.number_format(-1 * this.scale[4], units_pre, units_post), 'center', 'center');

        } else {

            RGraph.Text(context, font, text_size, (gutter * 3) + (this.graphwidth * (5/5)), gutter + this.halfTextHeight + this.graphheight + 2, RGraph.number_format(this.scale[4], units_pre, units_post), 'center', 'center');
            RGraph.Text(context, font, text_size, (gutter * 3) + (this.graphwidth * (4/5)), gutter + this.halfTextHeight + this.graphheight + 2, RGraph.number_format(this.scale[3], units_pre, units_post), 'center', 'center');
            RGraph.Text(context, font, text_size, (gutter * 3) + (this.graphwidth * (3/5)), gutter + this.halfTextHeight + this.graphheight + 2, RGraph.number_format(this.scale[2], units_pre, units_post), 'center', 'center');
            RGraph.Text(context, font, text_size, (gutter * 3) + (this.graphwidth * (2/5)), gutter + this.halfTextHeight + this.graphheight + 2, RGraph.number_format(this.scale[1], units_pre, units_post), 'center', 'center');
            RGraph.Text(context, font, text_size, (gutter * 3) + (this.graphwidth * (1/5)), gutter + this.halfTextHeight + this.graphheight + 2, RGraph.number_format(this.scale[0], units_pre, units_post), 'center', 'center');
        }
        
        this.context.fill();
        this.context.stroke();

        /**
        * The Y axis labels
        */
        if (typeof(this.Get('chart.labels')) == 'object') {
        
            var xOffset = 5;
            var font    = this.Get('chart.text.font');

            // Draw the X axis labels
            this.context.fillStyle = this.Get('chart.text.color');
            
            // How wide is each bar
            var barHeight = (this.canvas.height - (2 * gutter) ) / this.Get('chart.labels').length;
            
            // Reset the xTickGap
            yTickGap = (this.canvas.height - (2 * gutter)) / this.Get('chart.labels').length

            // Draw the X tickmarks
            var i=0;
            for (y=gutter + (yTickGap / 2); y<=this.canvas.height - gutter; y+=yTickGap) {
                RGraph.Text(this.context, font,
                                      this.Get('chart.text.size'),
                                      (gutter * 3) - xOffset,
                                      y,
                                      String(this.Get('chart.labels')[i++]),
                                      'center',
                                      'right');
            }
        }
    }
    
    
    /**
    * This function draws the actual bars
    */
    RGraph.HBar.prototype.Drawbars = function ()
    {
        this.context.lineWidth   = 1;
        this.context.strokeStyle = this.Get('chart.strokecolor');
        this.context.fillStyle   = this.Get('chart.colors')[0];
        var prevX                = 0;
        var prevY                = 0;

        /**
        * Work out the max value
        */
        if (this.Get('chart.xmax')) {
            this.scale = RGraph.getScale(this.Get('chart.xmax'));
            this.max   = this.scale[4];
        } else {
            var grouping = this.Get('chart.grouping');

            for (i=0; i<this.data.length; ++i) {
                if (typeof(this.data[i]) == 'object') {
                    var value = grouping == 'grouped' ? Number(RGraph.array_max(this.data[i], true)) : Number(RGraph.array_sum(this.data[i])) ;
                } else {
                    var value = Number(this.data[i]);
                }

                this.max = Math.max(Math.abs(this.max), Math.abs(value));
            }

            this.scale = RGraph.getScale(this.max);
            this.max   = this.scale[4];
        }


        /**
        * The bars are drawn HERE
        */
        var gutter     = this.Get('chart.gutter');
        var graphwidth = (this.canvas.width - (4 * gutter));
        var halfwidth  = graphwidth / 2;

        for (i=0; i<this.data.length; ++i) {

            // Work out the width and height
            var width  = (this.data[i] / this.max) *  graphwidth;
            var height = this.graphheight / this.data.length;

            var orig_height = height;

            var x       = 3 * gutter;
            var y       = gutter + (i * height);
            var vmargin = this.Get('chart.vmargin');
            var gutter  = gutter;

            // Account for negative lengths - Some browsers (eg Chrome) don't like a negative value
            if (width < 0) {
                x -= width;
                width = Math.abs(width);
            }

            /**
            * Turn on the shadow if need be
            */
            if (this.Get('chart.shadow')) {
                this.context.shadowColor   = this.Get('chart.shadow.color');
                this.context.shadowBlur    = this.Get('chart.shadow.blur');
                this.context.shadowOffsetX = this.Get('chart.shadow.offsetx');
                this.context.shadowOffsetY = this.Get('chart.shadow.offsety');
            }

            /**
            * Draw the bar
            */
            this.context.beginPath();
                if (typeof(this.data[i]) == 'number') {
                    
                    var barHeight = height - (2 * vmargin);
                    var barWidth  = (this.data[i] / this.max) * this.graphwidth;
                    var barX      = 3 * gutter;

                    // Account for Y axis pos
                    if (this.Get('chart.yaxispos') == 'center') {
                        barWidth /= 2;
                        barX += halfwidth;
                    }

                    // Set the fill color
                    this.context.strokeStyle = this.Get('chart.strokestyle');
                    this.context.fillStyle = this.Get('chart.colors')[0];

                    this.context.strokeRect(barX, gutter + (i * height) + this.Get('chart.vmargin'), barWidth, barHeight);
                    this.context.fillRect(barX, gutter + (i * height) + this.Get('chart.vmargin'), barWidth, barHeight);

                    /**
                    * Draw labels "above" the bar
                    */
                    if (this.Get('chart.labels.above')) {

                        this.context.fillStyle = this.Get('chart.text.color');
                        this.context.shadowOffsetX = 0;
                        this.context.shadowOffsetY = 0;
                        this.context.shadowBlur    = 0;
                        this.context.shadowColor   = 'rgba(0,0,0,0)';

                        RGraph.Text(
                                    this.context,
                                    this.Get('chart.text.font'),
                                    this.Get('chart.text.size'),
                                    barX + barWidth + 7,
                                    gutter + (i * height) + this.Get('chart.vmargin') + (barHeight / 2),
                                    String(this.Get('chart.units.pre') + this.data[i] + this.Get('chart.units.post')),
                                    'center',
                                    'left'
                                   );
                    }

                    this.coords[i] = [x, y, width, height];

                /**
                * Stacked bar chart
                */
                } else if (typeof(this.data[i]) == 'object' && this.Get('chart.grouping') == 'stacked') {

                    var barHeight     = height - (2 * vmargin);
                    var redrawCoords = [];// Necessary to draw if the shadow is enabled

                    for (j=0; j<this.data[i].length; ++j) {

                        // Set the fill/stroke colors
                        this.context.strokeStyle = this.Get('chart.strokestyle');
                        this.context.fillStyle = this.Get('chart.colors')[j];

                        var width = (this.data[i][j] / this.max) * this.graphwidth;
                        var totalWidth = (RGraph.array_sum(this.data[i]) / this.max) * this.graphwidth;

                        this.context.strokeRect(x, gutter + this.Get('chart.vmargin') + (this.graphheight / this.data.length) * i, width, height - (2 * vmargin) );
                        this.context.fillRect(x, gutter + this.Get('chart.vmargin') + (this.graphheight / this.data.length) * i, width, height - (2 * vmargin) );

                        /**
                        * Store the coords for tooltips
                        */
                        this.coords.push([x, y, width, height]);
                        
                        /**
                        * Store the redraw coords if the shadow is enabled
                        */
                        if (this.Get('chart.shadow')) {
                            redrawCoords.push([x, gutter + this.Get('chart.vmargin') + (this.graphheight / this.data.length) * i, width, height - (2 * vmargin), this.Get('chart.colors')[j]]);
                        }

                        x += width;
                    }

                    /**
                    * Redraw the bars if the shadow is enabled due to hem being drawn from the bottom up, and the
                    * shadow spilling over to higher up bars
                    */
                    if (this.Get('chart.shadow')) {
                        this.context.shadowColor = 'rgba(0,0,0,0)';
                        for (k=0; k<redrawCoords.length; ++k) {
                            this.context.strokeStyle = this.Get('chart.strokestyle');
                            this.context.fillStyle = redrawCoords[k][4];
                            this.context.strokeRect(redrawCoords[k][0], redrawCoords[k][1], redrawCoords[k][2], redrawCoords[k][3]);
                            this.context.fillRect(redrawCoords[k][0], redrawCoords[k][1], redrawCoords[k][2], redrawCoords[k][3]);

                            this.context.stroke();
                            this.context.fill();
                        }
                        
                        redrawCoords = [];
                    }
                    

                    /**
                    * Draw labels "above" the bar
                    */
                    if (this.Get('chart.labels.above')) {

                        this.context.fillStyle = this.Get('chart.text.color');
                        RGraph.NoShadow(this);

                        RGraph.Text(
                                    this.context,
                                    this.Get('chart.text.font'),
                                    this.Get('chart.text.size'),
                                    (gutter * 3) + totalWidth + 7,
                                    gutter + (i * height) + this.Get('chart.vmargin') + (barHeight / 2),
                                    String(this.Get('chart.units.pre') + RGraph.array_sum(this.data[i]) + this.Get('chart.units.post')),
                                    'center',
                                    'left'
                                   );
                    }

                /**
                * A grouped bar chart
                */
                } else if (typeof(this.data[i]) == 'object' && this.Get('chart.grouping') == 'grouped') {
                    for (j=0; j<this.data[i].length; ++j) {

                        /**
                        * Turn on the shadow if need be
                        */
                        if (this.Get('chart.shadow')) {
                            this.context.shadowColor   = this.Get('chart.shadow.color');
                            this.context.shadowBlur    = this.Get('chart.shadow.blur');
                            this.context.shadowOffsetX = this.Get('chart.shadow.offsetx');
                            this.context.shadowOffsetY = this.Get('chart.shadow.offsety');
                        }

                        // Set the fill/stroke colors
                        this.context.strokeStyle = this.Get('chart.strokestyle');
                        this.context.fillStyle = this.Get('chart.colors')[j]

                        var width = (this.data[i][j] / this.max) * (this.canvas.width - (4 * gutter) );
                        var individualBarHeight = (height - (2 * vmargin)) / this.data[i].length;

                        var startX = gutter * 3;
                        var startY = y + vmargin + (j * individualBarHeight);

                        // Account for the Y axis being in the middle
                        if (this.Get('chart.yaxispos') == 'center') {
                            width  /= 2;
                            startX += halfwidth;
                        }
                        
                        if (width < 0) {
                            startX += width;
                            width *= -1;
                        }

                        this.context.strokeRect(startX, startY, width, individualBarHeight);
                        this.context.fillRect(startX, startY, width, individualBarHeight);

                        /**
                        * Draw labels "above" the bar
                        */
                        if (this.Get('chart.labels.above')) {

                            this.context.fillStyle = this.Get('chart.text.color');
                            this.context.shadowOffsetX = 0;
                            this.context.shadowOffsetY = 0;
                            this.context.shadowBlur    = 0;
                            this.context.shadowColor   = 'rgba(0,0,0,0)';

                            var cnt = this.data[i].length;

                            RGraph.Text(
                                        this.context,
                                        this.Get('chart.text.font'),
                                        this.Get('chart.text.size'),
                                        startX + width + 7,
                                        startY + (individualBarHeight / 2),
                                        String(this.Get('chart.units.pre') + this.data[i][j]) + this.Get('chart.units.post'),
                                        'center',
                                        'left'
                                       );
                        }

                        this.coords.push([startX, startY - vmargin, width, individualBarHeight + (2 * vmargin)]);
                    }
                }

            this.context.closePath();
        }
        
        this.context.stroke();
        this.context.fill();

        /**
        * Now the bars are stroke()ed, turn off the shadow
        */
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
        this.context.shadowBlur    = 0;
        this.context.shadowColor    = 'rgba(0,0,0,0)';
    }