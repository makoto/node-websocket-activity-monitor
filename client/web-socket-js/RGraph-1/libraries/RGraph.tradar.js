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
    * The traditional radar chart constructor
    * 
    * @param string id   The ID of the canvas
    * @param array  data An array of data to represent
    */
    RGraph.Tradar = function (id, data)
    {
        this.id      = id;
        this.canvas  = document.getElementById(id);
        this.context = this.canvas.getContext('2d');
        this.canvas.__object__ = this;
        this.sizes   = [];
        this.center  = null;
        this.data    = data;
        this.max     = 0;
        this.type    = 'tradar';


        /**
        * Opera compatibility
        */
        RGraph.OperaCompat(this.context);

        
        this.properties = [];
        this.properties['chart.gutter']             = 25;
        this.properties['chart.color']              = 'rgba(255,0,0,0.5)';
        this.properties['chart.circle']             = 0;
        this.properties['chart.circle.fill']        = '#f00';
        this.properties['chart.labels']             = null;
        this.properties['chart.background.circles'] = true;
        this.properties['chart.text.size']          = 10;
        this.properties['chart.text.font']          = 'Verdana';
        this.properties['chart.text.color']          = 'black';
        this.properties['chart.title']              = '';
        this.properties['chart.title.vpos']         = null;
        this.properties['chart.linewidth']          = 1;
        this.properties['chart.key']                = null;
        this.properties['chart.key.background']     = 'white';
        this.properties['chart.key.position']       = 'gutter';
        this.properties['chart.key.shadow']         = false;
        this.properties['chart.contextmenu']        = null;
        this.properties['chart.annotatable']        = false;
        this.properties['chart.annotate.color']     = 'black';
        this.properties['chart.zoom.factor']        = 1.5;
        this.properties['chart.zoom.fade.in']       = true;
        this.properties['chart.zoom.fade.out']      = true;
        this.properties['chart.zoom.hdir']          = 'right';
        this.properties['chart.zoom.vdir']          = 'down';
        this.properties['chart.zoom.frames']        = 10;
        this.properties['chart.zoom.delay']         = 50;
        this.properties['chart.zoom.shadow']        = true;
        this.properties['chart.zoom.mode']             = 'canvas';
        this.properties['chart.zoom.thumbnail.width']  = 75;
        this.properties['chart.zoom.thumbnail.height'] = 75;
        
        // Must have at least 3 points
        if (this.data.length < 3) {
            alert('[TRADAR] You must specify at least 3 data points');
            return;
        }
        
        // Check the canvasText library has been included - this is now part of common
        if (typeof(RGraph) == 'undefined') {
            alert('[TRADAR] Fatal error: The RGraph common library does not appear to have been included');
        }
    }


    /**
    * A simple setter
    * 
    * @param string name  The name of the property to set
    * @param string value The value of the property
    */
    RGraph.Tradar.prototype.Set = function (name, value)
    {
        this.properties[name] = value;
    }


    /**
    * A simple hetter
    * 
    * @param string name  The name of the property to get
    */
    RGraph.Tradar.prototype.Get = function (name)
    {
        return this.properties[name];
    }


    /**
    * The draw method which does all the brunt of the work
    */
    RGraph.Tradar.prototype.Draw = function ()
    {
        this.size   = Math.min(this.canvas.width, this.canvas.height) - (2 * this.Get('chart.gutter'));
        this.center = this.size / 2;
        
        /**
        * Draw the title if necessary ** Needs to be before translating **
        */
        if (this.Get('chart.title')) {
            RGraph.DrawTitle(this.canvas, this.Get('chart.title'), this.Get('chart.gutter'), null, this.Get('chart.text.size') + 2);
        }
        
        this.context.save();
            this.context.translate(this.canvas.width / 2, (this.canvas.height + this.Get('chart.gutter')) / 2);
    
    
            this.DrawBackground();
            this.DrawAxes();
            this.DrawChart();
            this.DrawLabels();
        
        /**
        * Now translate back
        */
        this.context.restore();


        /**
        * Only draw the key if there's a circle defined, otherwise it's pointless
        */
        if (this.Get('chart.circle') && this.Get('chart.key')) {

            /**
            * Draw the key
            */
            this.Set('chart.colors', [this.Get('chart.color'), this.Get('chart.circle.fill')]);
            RGraph.DrawKey(this, this.Get('chart.key'), this.Get('chart.colors'));
        }


        /**
        * Setup the context menu if required
        */
        RGraph.ShowContext(this);

        this.context.beginPath();

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
    * The function which actually draws the radar chart
    */
    RGraph.Tradar.prototype.DrawChart = function ()
    {
        this.max = RGraph.array_max(this.data);
        
        this.context.strokeStyle = '#000';

        // First draw any circle
        if (this.Get('chart.circle')) {
            this.context.beginPath();
            this.radius = (this.Get('chart.circle') / this.max) * this.center;

            this.context.moveTo(0,0);
            this.context.arc(0,0, this.radius,6.28, 0, 1);
            this.context.closePath;

            this.context.stroke();

            // The circle fill style
            if (this.Get('chart.circle.fill')) {
                this.context.fillStyle = this.Get('chart.circle.fill');
                this.context.fill();
            }

        }
        
        if (!cum) {
            var cum = 0;
        }
        
        /**
        * Set the lineJoin etc
        */
        this.context.lineJoin  = 'round';
        this.context.lineCap   = 'round';
        this.context.lineWidth = this.Get('chart.linewidth');

        /**
        * Thi bit draws the graph
        */
        this.context.beginPath();
            for (i=0; i<this.data.length; ++i) {

                var value = this.data[i];
                var xPos  = (value / this.max) * this.center;

                // Store the xPos so we can use it to close the radar
                if (i == 0) {
                    this.finalXpos = xPos;
                }

                if (i == 0) {
                    this.context.moveTo(xPos, 0);

                } else {
                    this.context.lineTo(xPos,0);
                }

                var rad = RGraph.degrees2Radians(360 / this.data.length);
                this.context.rotate(rad);
            }

        this.context.closePath();

        this.context.stroke();
        this.context.fillStyle = this.Get('chart.color');
        this.context.fill();
    }


    /**
    * Draws the background circles
    */
    RGraph.Tradar.prototype.DrawBackground = function ()
    {
        /**
        * Draws the background circles
        */
        if (this.Get('chart.background.circles')) {
            this.context.strokeStyle = '#ddd';
            for (var r=5; r<this.center; r+=10) {

                // 0,0 because we've translated at this point
                this.context.moveTo(0,0);
                this.context.arc(0,0,r, 0, 6.28, 0);

                this.context.stroke();
            }
        }
    }


    /**
    * Draws the axes
    */
    RGraph.Tradar.prototype.DrawAxes = function ()
    {
        this.context.strokeStyle = '#000';

        var halfsize = this.size / 2;

        this.context.beginPath();

        // The X axis
        this.context.moveTo(0 - this.center, 0);
        this.context.lineTo(this.center, 0);
        
        // Draw the bits at either end of the X axis
        this.context.moveTo(0 - this.center, -5);
        this.context.lineTo(0 - this.center, 5);
        this.context.moveTo(this.center, -5);
        this.context.lineTo(this.center, 5);
        
        // Draw X axis tick marks
        for (var i=(this.center * -1); i<this.center; i+=halfsize / 10 ) {
            this.context.moveTo(i, -3);
            this.context.lineTo(i, 3);
        }
        
        // The Y axis
        this.context.moveTo(0, 0 - this.center);
        this.context.lineTo(0, this.center);

        // Draw the bits at the end of the y axis
        this.context.moveTo(0 - 5, 0 - this.center);
        this.context.lineTo(5, 0 - this.center );
        this.context.moveTo(0 - 5, 0 + this.center);
        this.context.lineTo(5, 0 + this.center);
        
        // Draw Y axis tick marks
        for (var i=(this.center * -1); i<this.center; i+=halfsize / 10 ) {
            this.context.moveTo(-3, i);
            this.context.lineTo(3, i);
        }
        
        this.context.stroke();
    }
    
    
    /**
    * This function adds the labels to the chart
    */
    RGraph.Tradar.prototype.DrawLabels = function ()
    {
        if (typeof(this.Get('chart.labels')) == 'object' && this.Get('chart.labels')[0]){
            
            // Set the font color
            this.context.fillStyle = this.Get('chart.text.color');

            this.context.lineWidth = 1;

            for (i=0; i<this.data.length; ++i) {
                var xOffset = (this.data[i] / this.max) * this.center;
                var angle   = RGraph.degrees2Radians((i / this.data.length) * 360);
                var hAlign  = 'left';
                var vAlign  = 'center';

                /**
                * Horizontal alignment
                */
                if (     (i / this.Get('chart.labels').length) > 0.25
                      && (i / this.Get('chart.labels').length) < 0.75) {
                    hAlign = 'right';
                
                } else if ( (i / this.Get('chart.labels').length) == 0.25 || (i / this.Get('chart.labels').length) == 0.75) {
                    hAlign = 'center';
                }



                RGraph.Text(this.context, this.Get('chart.text.font'), this.Get('chart.text.size'), xOffset + 15, 0, String(this.Get('chart.labels')[i]), vAlign, hAlign, null, 0 - (i / this.data.length) * 360, 'white');

                this.context.rotate(RGraph.degrees2Radians(360 / this.data.length));
            }
        }
    }