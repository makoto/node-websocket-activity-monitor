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
    * The bi-polar/age frequency constructor.
    * 
    * @param string id The id of the canvas
    * @param array  left  The left set of data points
    * @param array  right The right set of data points
    */
    RGraph.Bipolar = function (id, left, right)
    {
        // Get the canvas and context objects
        this.id         = id;
        this.canvas     = document.getElementById(id);
        this.context    = this.canvas.getContext('2d');
        this.canvas.__object__ = this;
        this.type              = 'bipolar';
        this.coords            = [];
        this.max               = 0;


        /**
        * Opera compatibility
        */
        RGraph.OperaCompat(this.context);

        
        // The left and right data respectively
        this.left       = left;
        this.right      = right;
        this.data       = [left, right];

        this.properties = [];
        this.properties['chart.margin']                = 2;
        this.properties['chart.xtickinterval']         = 25;
        this.properties['chart.labels']                = [];
        this.properties['chart.text.size']             = 10;
        this.properties['chart.text.color']            = 'black';
        this.properties['chart.text.font']             = 'Verdana';
        this.properties['chart.title.left']            = '';
        this.properties['chart.title.right']           = '';
        this.properties['chart.gutter']                = 25;
        this.properties['chart.title']                 = '';
        this.properties['chart.title.vpos']            = null;
        this.properties['chart.colors']                = ['#fcf', '#00f',
                                                          '#f00', '#0f0',
                                                          '#ff0', '#0ff',
                                                          '#f0f', '#ff6101',
                                                          '#b401ff', '#e4ff01',
                                                          '#fb8195', '#ccc'];
        this.properties['chart.contextmenu']           = null;
        this.properties['chart.tooltips']              = null;
        this.properties['chart.tooltip.effect']        = 'fade';
        this.properties['chart.units.pre']             = '';
        this.properties['chart.units.post']            = '';
        this.properties['chart.shadow']                = false;
        this.properties['chart.shadow.color']          = '#666';
        this.properties['chart.shadow.offsetx']        = 3;
        this.properties['chart.shadow.offsety']        = 3;
        this.properties['chart.shadow.blur']           = 3;
        this.properties['chart.annotatable']           = false;
        this.properties['chart.annotate.color']        = '#000';
        this.properties['chart.xmax']                  = null;
        this.properties['chart.scale.decimals']        = null;
        this.properties['chart.axis.color']            = 'black';
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

        // Pad the arrays so they're the same size
        while (this.left.length < this.right.length) this.left.push(0);
        while (this.left.length > this.right.length) this.right.push(0);

        // Check the common library has been included
        if (typeof(RGraph) == 'undefined') {
            alert('[BIPOLAR] Fatal error: The common library does not appear to have been included');
        }
    }


    /**
    * The setter
    * 
    * @param name  string The name of the parameter to set
    * @param value mixed  The value of the paraneter 
    */
    RGraph.Bipolar.prototype.Set = function (name, value)
    {
        this.properties[name.toLowerCase()] = value;
    }


    /**
    * The getter
    * 
    * @param name string The name of the parameter to get
    */
    RGraph.Bipolar.prototype.Get = function (name)
    {
        return this.properties[name.toLowerCase()];
    }


    /**
    * Draws the axes
    */
    RGraph.Bipolar.prototype.DrawAxes = function ()
    {
        // Draw the left set of axes
        this.context.beginPath();
        this.context.strokeStyle = this.Get('chart.axis.color');

        this.axisWidth  = (this.canvas.width - 60 ) / 2;
        this.axisHeight = this.canvas.height - (2 * this.Get('chart.gutter'));

        this.context.moveTo(this.Get('chart.gutter'), this.canvas.height - this.Get('chart.gutter'));
        this.context.lineTo(this.axisWidth, this.canvas.height - this.Get('chart.gutter'));
        this.context.lineTo(this.axisWidth, this.Get('chart.gutter'));
        
        this.context.stroke();

        // Draw the right set of axes
        this.context.beginPath();

        this.axisWidth  = ((this.canvas.width - 60) / 2) + 60;
        
        this.context.moveTo(this.axisWidth, this.Get('chart.gutter'));
        this.context.lineTo(this.axisWidth, this.canvas.height - this.Get('chart.gutter'));
        this.context.lineTo(this.canvas.width - this.Get('chart.gutter'), this.canvas.height - this.Get('chart.gutter'));

        this.context.stroke();
    }


    /**
    * Draws the tick marks on the axes
    */
    RGraph.Bipolar.prototype.DrawTicks = function ()
    {
        var numDataPoints = this.left.length;
        var barHeight     = ( (this.canvas.height - (2 * this.Get('chart.gutter')))- (this.left.length * (this.Get('chart.margin') * 2) )) / numDataPoints;
        
        // Draw the left Y tick marks
        for (var i = this.canvas.height - this.Get('chart.gutter'); i >= this.Get('chart.gutter'); i -= (barHeight + ( this.Get('chart.margin') * 2)) ) {
            if (i < (this.canvas.height - this.Get('chart.gutter')) ) {
                this.context.beginPath();
                this.context.moveTo(this.axisWidth - 60, i);
                this.context.lineTo(this.axisWidth - 60 + 3, i);
                this.context.stroke();
            }
        }

        //Draw the right axis Y tick marks
        for (var i = this.canvas.height - this.Get('chart.gutter'); i >= this.Get('chart.gutter'); i -= (barHeight + ( this.Get('chart.margin') * 2)) ) {
            if (i < (this.canvas.height - this.Get('chart.gutter')) ) {
                this.context.beginPath();
                this.context.moveTo(this.axisWidth, i);
                this.context.lineTo(this.axisWidth - 3, i);
                this.context.stroke();
            }
        }
        
        // Draw the left sides X tick marks
        var xInterval = (this.canvas.width - (2 * this.Get('chart.gutter')) - 60) / 10;
        
        for (i=this.Get('chart.gutter'); i<(this.canvas.width - 60 ) / 2; i += xInterval) {
            this.context.beginPath();
            this.context.moveTo(i, this.canvas.height - this.Get('chart.gutter'));  // 4 is the tick height
            this.context.lineTo(i, (this.canvas.height - this.Get('chart.gutter')) + 4);
            this.context.closePath();
            
            this.context.stroke();
        }

        // Draw the right sides X tick marks
        var stoppingPoint = (this.canvas.width - (2 * this.Get('chart.gutter')) - 60) / 2;
        var stoppingPoint = stoppingPoint + 60 + this.Get('chart.gutter')

        for (i=this.canvas.width  - this.Get('chart.gutter'); i > stoppingPoint; i-=xInterval) {
            this.context.beginPath();
                this.context.moveTo(i, this.canvas.height - this.Get('chart.gutter'));
                this.context.lineTo(i, (this.canvas.height - this.Get('chart.gutter')) + 4);
            this.context.closePath();
            
            this.context.stroke();
        }
        
        // Store this for later
        this.barHeight = barHeight;
    }


    /**
    * Figures out the maximum value, or if defined, uses xmax
    */
    RGraph.Bipolar.prototype.GetMax = function()
    {
        var max = 0;
        var dec = this.Get('chart.scale.decimals');
        
        // chart.xmax defined
        if (this.Get('chart.xmax')) {

            max = this.Get('chart.xmax');
            
            this.scale    = [];
            this.scale[0] = Number((max / 5) * 1).toFixed(dec);
            this.scale[1] = Number((max / 5) * 2).toFixed(dec);
            this.scale[2] = Number((max / 5) * 3).toFixed(dec);
            this.scale[3] = Number((max / 5) * 4).toFixed(dec);
            this.scale[4] = Number(max).toFixed(dec);

            this.max = max;
            

        // Generate the scale ourselves
        } else {
            this.leftmax  = RGraph.array_max(this.left);
            this.rightmax = RGraph.array_max(this.right);
            max = Math.max(this.leftmax, this.rightmax);

            this.scale    = RGraph.getScale(max);
            this.scale[0] = Number(this.scale[0]).toFixed(dec);
            this.scale[1] = Number(this.scale[1]).toFixed(dec);
            this.scale[2] = Number(this.scale[2]).toFixed(dec);
            this.scale[3] = Number(this.scale[3]).toFixed(dec);
            this.scale[4] = Number(this.scale[4]).toFixed(dec);

            this.max = this.scale[4];
        }

        // Don't need to return it as it is stored in this.max
    }


    /**
    * Function to draw the left hand bars
    */
    RGraph.Bipolar.prototype.DrawLeftBars = function ()
    {
        // Set the stroke colour
        this.context.strokeStyle = '#333';

        for (i=0; i<this.left.length; ++i) {
            
            /**
            * Turn on a shadow if requested
            */
            if (this.Get('chart.shadow')) {
                this.context.shadowColor   = this.Get('chart.shadow.color');
                this.context.shadowBlur    = this.Get('chart.shadow.blur');
                this.context.shadowOffsetX = this.Get('chart.shadow.offsetx');
                this.context.shadowOffsetY = this.Get('chart.shadow.offsety');
            }

            this.context.beginPath();

            // Set the colour
            if (this.Get('chart.colors')[i]) {
                this.context.fillStyle = this.Get('chart.colors')[i];
            }

            var width = ( (this.left[i] / this.max) * ((this.canvas.width - 60 - (2 * this.Get('chart.gutter')) ) / 2) );
            this.context.strokeRect(this.axisWidth - 60 - width,
                                    this.Get('chart.margin') + (i * ( (this.canvas.height - (2 * this.Get('chart.gutter')) ) / this.left.length)) + this.Get('chart.gutter'),
                                    width,
                                    this.barHeight);
            this.context.fillRect(this.axisWidth - 60 - width,
                                    this.Get('chart.margin') + (i * ( (this.canvas.height - (2 * this.Get('chart.gutter'))) / this.left.length)) + this.Get('chart.gutter'),
                                    width,
                                    this.barHeight);

            this.context.closePath();
            /**
            * Add the coordinates to the coords array
            */
            this.coords.push([this.axisWidth - 60 - width - this.Get('chart.margin'),
                                     this.Get('chart.margin') + (i * ( (this.canvas.height - (2 * this.Get('chart.gutter')) ) / this.left.length)) + this.Get('chart.gutter'),
                                     width + (2 * this.Get('chart.margin') ),
                                     this.barHeight
                                    ]);
        }

        /**
        * Turn off any shadow
        */
        this.context.shadowColor   = 'rgba(0,0,0,0)';
        this.context.shadowBlur    = 0;
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
    }


    /**
    * Function to draw the right hand bars
    */
    RGraph.Bipolar.prototype.DrawRightBars = function ()
    {
        // Set the stroke colour
        this.context.strokeStyle = '#333';
            
        /**
        * Turn on a shadow if requested
        */
        if (this.Get('chart.shadow')) {
            this.context.shadowColor   = this.Get('chart.shadow.color');
            this.context.shadowBlur    = this.Get('chart.shadow.blur');
            this.context.shadowOffsetX = this.Get('chart.shadow.offsetx');
            this.context.shadowOffsetY = this.Get('chart.shadow.offsety');
        }

        for (i=0; i<this.right.length; ++i) {
            this.context.beginPath();

            // Set the colour
            if (this.Get('chart.colors')[i]) {
                this.context.fillStyle = this.Get('chart.colors')[i];
            }

            var width = ( (this.right[i] / this.max) * ((this.canvas.width - 60 - (2 * this.Get('chart.gutter')) ) / 2) );

            this.context.strokeRect(this.axisWidth,
                                    this.Get('chart.margin') + (i * ((this.canvas.height - (2 * this.Get('chart.gutter'))) / this.right.length)) + this.Get('chart.gutter'),
                                    width,
                                    this.barHeight);
            this.context.fillRect(this.axisWidth,
                                    this.Get('chart.margin') + (i * ((this.canvas.height - (2 * this.Get('chart.gutter'))) / this.right.length)) + this.Get('chart.gutter'),
                                    width,
                                    this.barHeight);

            this.context.closePath();
            
            /**
            * Add the coordinates to the coords array
            */
            this.coords.push([this.axisWidth - this.Get('chart.margin'),
                                     this.Get('chart.margin') + (i * ((this.canvas.height - (2 * this.Get('chart.gutter'))) / this.right.length)) + this.Get('chart.gutter'),
                                     width + (2 * this.Get('chart.margin')),
                                     this.barHeight]);
        }
        
        this.context.stroke();

        /**
        * Turn off any shadow
        */
        this.context.shadowColor   = 'rgba(0,0,0,0)';
        this.context.shadowBlur    = 0;
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
    }


    /**
    * Draws the titles
    */
    RGraph.Bipolar.prototype.DrawLabels = function ()
    {
        this.context.fillStyle = this.Get('chart.text.color');

        var labelPoints = new Array();
        var font = this.Get('chart.text.font');
        var size = this.Get('chart.text.size');
        
        var max = Math.max(this.left.length, this.right.length);
        
        for (i=0; i<max; ++i) {
            var barAreaHeight = this.canvas.height - (2 * this.Get('chart.gutter'));
            var barHeight     = barAreaHeight / this.left.length;
            var yPos          = (i * barAreaHeight) + this.Get('chart.gutter');

            labelPoints.push(this.Get('chart.gutter') + (i * barHeight) + (barHeight / 2) + 5);
        }

        for (i=0; i<labelPoints.length; ++i) {
            RGraph.Text(this.context, this.Get('chart.text.font'),
                                        this.Get('chart.text.size'),
                                        this.canvas.width / 2,
                                        labelPoints[i],
                                        String(this.Get('chart.labels')[i] ? this.Get('chart.labels')[i] : ''), null, 'center');
        }

        // Now draw the X labels for the left hand side
        RGraph.Text(this.context, font, size, this.Get('chart.gutter'), this.canvas.height - this.Get('chart.gutter') + 14, RGraph.number_format(this.scale[4], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');
        RGraph.Text(this.context, font, size, this.Get('chart.gutter') + ((this.canvas.width - 60 - (2 * this.Get('chart.gutter'))) / 2) * (1/5), this.canvas.height - this.Get('chart.gutter') + 14, RGraph.number_format(this.scale[3], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');
        RGraph.Text(this.context, font, size, this.Get('chart.gutter') + ((this.canvas.width - 60 - (2 * this.Get('chart.gutter'))) / 2) * (2/5), this.canvas.height - this.Get('chart.gutter') + 14, RGraph.number_format(this.scale[2], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');
        RGraph.Text(this.context, font, size, this.Get('chart.gutter') + ((this.canvas.width - 60 - (2 * this.Get('chart.gutter'))) / 2) * (3/5), this.canvas.height - this.Get('chart.gutter') + 14, RGraph.number_format(this.scale[1], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');
        RGraph.Text(this.context, font, size, this.Get('chart.gutter') + ((this.canvas.width - 60 - (2 * this.Get('chart.gutter'))) / 2) * (4/5), this.canvas.height - this.Get('chart.gutter') + 14, RGraph.number_format(this.scale[0], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');

        // Now draw the X labels for the right hand side
        RGraph.Text(this.context, font, size, this.canvas.width - this.Get('chart.gutter'), this.canvas.height - this.Get('chart.gutter') + 14, RGraph.number_format(this.scale[4], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');
        RGraph.Text(this.context, font, size, this.canvas.width - (this.Get('chart.gutter') + ((this.canvas.width - 60 - (2 * this.Get('chart.gutter'))) / 2) * (1/5)), this.canvas.height - this.Get('chart.gutter') + 14,RGraph.number_format(this.scale[3], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');
        RGraph.Text(this.context, font, size, this.canvas.width - (this.Get('chart.gutter') + ((this.canvas.width - 60 - (2 * this.Get('chart.gutter'))) / 2) * (2/5)), this.canvas.height - this.Get('chart.gutter') + 14,RGraph.number_format(this.scale[2], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');
        RGraph.Text(this.context, font, size, this.canvas.width - (this.Get('chart.gutter') + ((this.canvas.width - 60 - (2 * this.Get('chart.gutter'))) / 2) * (3/5)), this.canvas.height - this.Get('chart.gutter') + 14,RGraph.number_format(this.scale[1], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');
        RGraph.Text(this.context, font, size, this.canvas.width - (this.Get('chart.gutter') + ((this.canvas.width - 60 - (2 * this.Get('chart.gutter'))) / 2) * (4/5)), this.canvas.height - this.Get('chart.gutter') + 14,RGraph.number_format(this.scale[0], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');
    }
    
    /**
    * Draws the titles
    */
    RGraph.Bipolar.prototype.DrawTitles = function ()
    {
        RGraph.Text(this.context, this.Get('chart.text.font'), this.Get('chart.text.size'), 30, (this.Get('chart.gutter') / 2) + 5, String(this.Get('chart.title.left')), 'center');
        RGraph.Text(this.context,this.Get('chart.text.font'), this.Get('chart.text.size'), this.canvas.width - 30, (this.Get('chart.gutter') / 2) + 5, String(this.Get('chart.title.right')), 'center', 'right');
        
        // Draw the main title for the whole chart
        RGraph.DrawTitle(this.canvas, this.Get('chart.title'), this.Get('chart.gutter'));
    }

    
    /**
    * Draws the graph
    */
    RGraph.Bipolar.prototype.Draw = function ()
    {
        // Reset the data to what was initially supplied
        this.left  = this.data[0];
        this.right = this.data[1];

        /**
        * Reset the coords array
        */
        this.coords = [];

        this.GetMax();
        this.DrawAxes();
        this.DrawTicks();
        this.DrawLeftBars();
        this.DrawRightBars();

        if (this.Get('chart.axis.color') != 'black') {
            this.DrawAxes(); // Draw the axes again (if the axes color is not black)
        }

        this.DrawLabels();
        this.DrawTitles();
        
        /**
        * Setup the context menu if required
        */
        RGraph.ShowContext(this);


        /**
        * Install the on* event handlers
        */
        if (this.Get('chart.tooltips')) {


            // Register the object so that it gets redrawn
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
                for (var i=0; i<obj.coords.length; i++) {

                    var mouseX = mouseCoords[0];  // In relation to the canvas
                    var mouseY = mouseCoords[1];  // In relation to the canvas
                    var left   = obj.coords[i][0];
                    var top    = obj.coords[i][1];
                    var width  = obj.coords[i][2];
                    var height = obj.coords[i][3];

                    if (mouseX >= (left + obj.Get('chart.margin')) && mouseX <= (left + width - obj.Get('chart.margin') ) && mouseY >= top && mouseY <= (top + height) ) {
                        canvas.style.cursor = document.all ? 'hand' : 'pointer';
                        return;
                    }
                }
                    
                canvas.style.cursor = null;
            }


            /**
            * Install the onclick event handler for the tooltips
            */
            this.canvas.onclick = function (e)
            {
                e = RGraph.FixEventObject(document.all ? event : e);

                var canvas = document.getElementById(this.id)
                var obj = canvas.__object__;

                /**
                * Redraw the graph first, in effect resetting the graph to as it was when it was first drawn
                * This "deselects" any already selected bar
                */
                RGraph.Clear(canvas);
                obj.Draw();
    
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

                    if (mouseX >= (left + obj.Get('chart.margin')) && mouseX <= (left + width- obj.Get('chart.margin')) && mouseY >= top && mouseY <= (top + height) ) {
                        
                        obj.context.beginPath();
                        obj.context.strokeStyle = '#000';
                        obj.context.fillStyle   = 'rgba(255,255,255,0.5)';
                        obj.context.strokeRect(left + obj.Get('chart.margin'), top, width - (2 * obj.Get('chart.margin')), height);
                        obj.context.fillRect(left + obj.Get('chart.margin'), top, width - (2 * obj.Get('chart.margin')), height);
    
                        obj.context.stroke();
                        obj.context.fill();
    
                        /**
                        * Show a tooltip if it's defined
                        * FIXME pageX and pageY not supported in MSIE
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
        * If the canvas is annotatable, do install the event handlers
        */
        RGraph.Annotate(this);
        
        /**
        * This bit shows the mini zoom window if requested
        */
        RGraph.ShowZoomWindow(this);
    }