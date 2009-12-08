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
    * The gantt chart constructor
    * 
    * @param object canvas The cxanvas object
    * @param array  data   The chart data
    */
    RGraph.Gantt = function (id)
    {
        // Get the canvas and context objects
        this.id      = id;
        this.canvas  = document.getElementById(id);
        this.context = this.canvas.getContext("2d");
        this.canvas.__object__ = this;
        this.type              = 'gantt';


        /**
        * Opera compatibility
        */
        RGraph.OperaCompat(this.context);

        
        // Set some defaults
        this.properties = [];
        this.properties['chart.background.barcolor1']  = 'white';
        this.properties['chart.background.barcolor2']  = 'white';
        this.properties['chart.background.grid']       = true;
        this.properties['chart.background.grid.width'] = 1;
        this.properties['chart.background.grid.color'] = '#ddd';
        this.properties['chart.background.grid.hsize'] = 20;
        this.properties['chart.background.grid.vsize'] = 20;
        this.properties['chart.background.vbars']      = [];
        this.properties['chart.text.size']             = 10;
        this.properties['chart.text.font']             = 'Verdana';
        this.properties['chart.text.color']            = 'black';
        this.properties['chart.gutter']                = 25;
        this.properties['chart.labels']                = [];
        this.properties['chart.margin']                = 2;
        this.properties['chart.title']                 = '';
        this.properties['chart.title.vpos']            = null;
        this.properties['chart.events']                = [];
        this.properties['chart.borders']               = true;
        this.properties['chart.defaultcolor']          = 'white';
        this.properties['chart.coords']                = [];
        this.properties['chart.tooltips']              = [];
        this.properties['chart.tooltip.effect']        = 'fade';
        this.properties['chart.xmax']                  = 0;
        this.properties['chart.contextmenu']           = null;
        this.properties['chart.annotatable']           = false;
        this.properties['chart.annotate.color']        = 'black';
        this.properties['chart.zoom.factor']           = 1.5;
        this.properties['chart.zoom.fade.in']          = true;
        this.properties['chart.zoom.fade.out']         = true;
        this.properties['chart.zoom.hdir']             = 'right';
        this.properties['chart.zoom.vdir']             = 'down';
        this.properties['chart.zoom.frames']           = 10;
        this.properties['chart.zoom.delay']            = 50;
        this.properties['chart.zoom.shadow']           = true;
        this.properties['chart.zoom.mode']             = 'canvas';
        this.properties['chart.zoom.thumbnail.width']  = 75;
        this.properties['chart.zoom.thumbnail.height'] = 75;

        // Check the common library has been included
        if (typeof(RGraph) == 'undefined') {
            alert('[GANTT] Fatal error: The common library does not appear to have been included');
        }
    }


    /**
    * A peudo setter
    * 
    * @param name  string The name of the property to set
    * @param value mixed  The value of the property
    */
    RGraph.Gantt.prototype.Set = function (name, value)
    {
        this.properties[name] = value;
    }


    /**
    * A peudo getter
    * 
    * @param name  string The name of the property to get
    */
    RGraph.Gantt.prototype.Get = function (name)
    {
        return this.properties[name];
    }

    
    /**
    * Draws the chart
    */
    RGraph.Gantt.prototype.Draw = function ()
    {
        var gutter = this.Get('chart.gutter');

        /**
        * Work out the graphArea
        */
        this.graphArea     = this.canvas.width - (2 * gutter);
        this.graphHeight   = this.canvas.height - (2 * gutter);
        this.numEvents     = this.Get('chart.events').length
        this.barHeight     = this.graphHeight / this.numEvents;
        this.halfBarHeight = this.barHeight / 2;

        /**
        * Draw the background
        */
        RGraph.background.Draw(this);
        
        /**
        * Draw a space for the left hand labels
        */
        this.context.beginPath();
        this.context.lineWidth   = 1;
        this.context.strokeStyle = this.Get('chart.background.grid.color');
        this.context.fillStyle   = 'white';
        this.context.fillRect(0,gutter - 5,gutter * 3, this.canvas.height - (2 * gutter) + 10);
        this.context.moveTo(gutter * 3, gutter);
        this.context.lineTo(gutter * 3, this.canvas.height - gutter);
        
        this.context.stroke();
        this.context.fill();
        
        /**
        * Draw the labels at the top
        */
        this.DrawLabels();
        
        /**
        * Draw the events
        */
        this.DrawEvents();
        
        
        /**
        * Setup the context menu if required
        */
        RGraph.ShowContext(this);
        
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
    * Draws the labels at the top and the left of the chart
    */
    RGraph.Gantt.prototype.DrawLabels = function ()
    {
        var gutter = this.Get('chart.gutter');

        this.context.beginPath();
        this.context.fillStyle = this.Get('chart.text.color');

        /**
        * Draw the X labels at the top of the chart.
        */
        var labelSpace = (this.graphArea - (2 * gutter)) / this.Get('chart.labels').length;
        var xPos       = (3 * gutter) + (labelSpace / 2);
        this.context.strokeStyle = 'black'

        for (i=0; i<this.Get('chart.labels').length; ++i) {
            RGraph.Text(this.context, this.Get('chart.text.font'), this.Get('chart.text.size'), xPos + (i * labelSpace), gutter * (3/4), String(this.Get('chart.labels')[i]), 'center', 'center');
        }
        
        // Draw the vertical labels
        for (i=0; i<this.Get('chart.events').length; ++i) {
            var e = this.Get('chart.events')[i];
            var x = (3 * gutter);
            var y = gutter + this.halfBarHeight + (i * this.barHeight);

            RGraph.Text(this.context, this.Get('chart.text.font'), this.Get('chart.text.size'), x - 5, y, String(e[3]), 'center', 'right');
        }
    }
    
    /**
    * Draws the events to the canvas
    */
    RGraph.Gantt.prototype.DrawEvents = function ()
    {
        var canvas  = this.canvas;
        var context = this.context;
        var gutter  = this.Get('chart.gutter');
        var events  = this.Get('chart.events');

        /**
        * Reset the coords array to prevent it growing
        */
        this.coords = [];

        /**
        * First draw the vertical bars that have been added
        */if (this.Get('chart.vbars')) {
            for (i=0; i<this.Get('chart.vbars').length; ++i) {
                // Boundary checking
                if (this.Get('chart.vbars')[i][0] + this.Get('chart.vbars')[i][1] > this.Get('chart.xmax')) {
                    this.Get('chart.vbars')[i][1] = 364 - this.Get('chart.vbars')[i][0];
                }
    
                var barX   = (3 * gutter) + (this.Get('chart.vbars')[i][0] / this.Get('chart.xmax')) * (this.graphArea - (2 * gutter) );
                var barY   = gutter;
                var width  = ( (this.graphArea - (2 * gutter)) / this.Get('chart.xmax')) * this.Get('chart.vbars')[i][1];
                var height = canvas.height - (2 * gutter);
    
                context.fillStyle = this.Get('chart.vbars')[i][2];
                context.fillRect(barX, barY, width, height);
            }
        }

        for (i=0; i<events.length; ++i) {
            
            var event = events[i];

            context.beginPath();
            context.strokeStyle = '#000';
            context.fillStyle = event[4] ? event[4] : this.Get('chart.defaultcolor');

            var barStartX  = (3 * gutter) + (event[0] / this.Get('chart.xmax')) * (this.graphArea - (2 * gutter) );
            //barStartX += this.margin;
            var barStartY  = gutter + (i * this.barHeight);
            var barWidth   = (event[1] / this.Get('chart.xmax')) * (this.graphArea - (2 * gutter));

            /**
            * If the width is greater than the graph atrea, curtail it
            */
            if ( (barStartX + barWidth) > (canvas.width - gutter) ) {
                barWidth = canvas.width - gutter - barStartX;
            }

            /**
            *  Draw the actual bar storing store the coordinates
            */
            this.coords.push([barStartX, barStartY + this.Get('chart.margin'), barWidth, this.barHeight - (2 * this.Get('chart.margin'))]);
            context.fillRect(barStartX, barStartY + this.Get('chart.margin'), barWidth, this.barHeight - (2 * this.Get('chart.margin')) );

            // Work out the completeage indicator
            var complete = (event[2] / 100) * barWidth;

            // Draw the % complete indicator. If it's greater than 0
            if (typeof(event[2]) == 'number') {
                context.beginPath();
                context.fillStyle = event[5] ? event[5] : '#0c0';
                context.fillRect(barStartX,
                                      barStartY + this.Get('chart.margin'),
                                      (event[2] / 100) * barWidth,
                                      this.barHeight - (2 * this.Get('chart.margin')) );
                
                context.beginPath();
                context.fillStyle = this.Get('chart.text.color');
                RGraph.Text(context, this.Get('chart.text.font'), this.Get('chart.text.size'), barStartX + barWidth + 5, barStartY + this.halfBarHeight, String(event[2]) + '%', 'center');
            }

            // Redraw the border around the bar
            if (this.Get('chart.borders')) {
                context.strokeStyle = '#000';
                context.beginPath();
                context.strokeRect(barStartX, barStartY + this.Get('chart.margin'), barWidth, this.barHeight - (2 * this.Get('chart.margin')) );
            }
        }


        /**
        * If TOOLTIPS are defined, handle them
        */
        if (this.Get('chart.tooltips') && this.Get('chart.tooltips').length) {

            // Register the object for redrawing
            RGraph.Register(this);

            /**
            * If the cursor is over a hotspot, change the cursor to a hand
            */
            this.canvas.onmousemove = function (e)
            {
                e = RGraph.FixEventObject(document.all ? event : e);

                var canvas = e.target;
                var obj = canvas.__object__;

                /**
                * Get the mouse X/Y coordinates
                */
                var mouseCoords = RGraph.getMouseXY(e);

                /**
                * Loop through the bars determining if the mouse is over a bar
                */
                for (var i=0, len=obj.coords.length; i<len; i++) {

                    var mouseX = mouseCoords[0];  // In relation to the canvas
                    var mouseY = mouseCoords[1];  // In relation to the canvas
                    var left   = obj.coords[i][0];
                    var top    = obj.coords[i][1];
                    var width  = obj.coords[i][2];
                    var height = obj.coords[i][3];

                    if (mouseX >= left && mouseX <= (left + width) && mouseY >= top && mouseY <= (top + height) ) {
                        canvas.style.cursor = document.all ? 'hand' : 'pointer';
                        return;
                    }
                }

                canvas.style.cursor = null;
            }


            this.canvas.onclick = function (e)
            {
                e = RGraph.FixEventObject(document.all ? event : e);

                var canvas  = e.target;
                var context = canvas.getContext('2d');
                var obj     = canvas.__object__;

                var mouseCoords = RGraph.getMouseXY(e);
                var mouseX      = mouseCoords[0];
                var mouseY      = mouseCoords[1];
                
                
                for (i=0; i<obj.coords.length; ++i) {
                    
                    var idx = i;
                    var xCoord = obj.coords[i][0];
                    var yCoord = obj.coords[i][1];
                    var width  = obj.coords[i][2];
                    var height = obj.coords[i][3];

                    if (
                           mouseX >= xCoord
                        && (mouseX <= xCoord + width)
                        && mouseY >= yCoord
                        && (mouseY <= yCoord + height)
                        && obj.Get('chart.tooltips')[i]
                       ) {

                       // Redraw the graph
                        RGraph.Redraw();
                    
                        // SHOW THE CORRECT TOOLTIP
                        RGraph.Tooltip(canvas, obj.Get('chart.tooltips')[idx], e.pageX, e.pageY);
                        
                        /**
                        * Draw a rectangle around the correct bar, in effect highlighting it
                        */
                        context.strokeStyle = '#000';
                        context.fillStyle = 'rgba(255,255,255,0.8)';
                        context.strokeRect(xCoord, yCoord, width, height);
                        context.fillRect(xCoord + 1, yCoord + 1, width - 2, height - 2);

                        e.stopPropagation = true;
                        e.cancelBubble = true;
                        return;
                    }
                }
            }

        // This resets the canvas events - getting rid of any installed event handlers
        } else {
            this.canvas.onclick     = null;
            this.canvas.onmousemove = null;
        }
    }