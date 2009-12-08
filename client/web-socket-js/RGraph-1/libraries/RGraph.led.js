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
    * The LED lights constructor
    * 
    * @param object canvas The canvas object
    * @param array  data   The chart data
    */
    RGraph.LED = function (id, text)
    {
        // Get the canvas and context objects
        this.id                = id;
        this.canvas            = document.getElementById(id);
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.canvas.__object__ = this;
        this.type              = 'led';


        /**
        * Opera compatibility
        */
        RGraph.OperaCompat(this.context);


        /**
        * Set the string that is to be displayed
        */
        this.text = text;
        
        /**
        * The letters and numbers
        */
        this.lights = [];
        this.lights['a'] = [[0,1,1,0],[1,0,0,1],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1],[1,0,0,1]];
        this.lights['b'] = [[1,1,1,0],[1,0,0,1],[1,0,0,1],[1,1,1,0],[1,0,0,1],[1,0,0,1],[1,1,1,0]];
        this.lights['c'] = [[0,1,1,0],[1,0,0,1],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,1],[0,1,1,0]];
        this.lights['d'] = [[1,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,1,1,0]];
        this.lights['e'] = [[1,1,1,1],[1,0,0,0],[1,0,0,0],[1,1,1,0],[1,0,0,0],[1,0,0,0],[1,1,1,1]];
        this.lights['f'] = [[1,1,1,1],[1,0,0,0],[1,0,0,0],[1,1,1,0],[1,0,0,0],[1,0,0,0],[1,0,0,0]];
        this.lights['g'] = [[0,1,1,0],[1,0,0,1],[1,0,0,0],[1,0,1,1],[1,0,0,1],[1,0,0,1],[0,1,1,0]];
        this.lights['h'] = [[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1],[1,0,0,1]];
        this.lights['i'] = [[0,1,1,1],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,1,1,1]];
        this.lights['j'] = [[0,1,1,1],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,1,0,0]];
        this.lights['k'] = [[1,0,0,1],[1,0,0,1],[1,0,1,0],[1,1,0,0],[1,0,1,0],[1,0,0,1],[1,0,0,1]];
        this.lights['l'] = [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,1,1,1]];
        this.lights['m'] = [[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1]];
        this.lights['n'] = [[1,0,0,1],[1,1,0,1],[1,0,1,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1]];
        this.lights['o'] = [[0,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0]];
        this.lights['p'] = [[1,1,1,0],[1,0,0,1],[1,0,0,1],[1,1,1,0],[1,0,0,0],[1,0,0,0],[1,0,0,0]];
        this.lights['q'] = [[0,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,1,1],[0,1,1,1]];
        this.lights['r'] = [[1,1,1,0],[1,0,0,1],[1,0,0,1],[1,1,1,0],[1,0,1,0],[1,0,0,1],[1,0,0,1]];
        this.lights['s'] = [[0,1,1,0],[1,0,0,1],[1,0,0,0],[0,1,1,0],[0,0,0,1],[1,0,0,1],[0,1,1,0]];
        this.lights['t'] = [[1,1,1,0],[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]];
        this.lights['u'] = [[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0]];
        this.lights['v'] = [[1,0,1],[1,0,1],[1,0,1],[1,0,1],[1,0,1],[0,1,0],[0,1,0]];
        this.lights['w'] = [[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,1,1,1],[0,1,1,0]];
        this.lights['x'] = [[0,1,0,1],[0,1,0,1],[0,1,0,1],[0,0,1,0],[0,1,0,1],[0,1,0,1],[0,1,0,1]];
        this.lights['y'] = [[0,1,0,1],[0,1,0,1],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]];
        this.lights['z'] = [[1,1,1,1],[0,0,0,1],[0,0,1,0],[0,0,1,0],[0,1,0,0],[1,0,0,0],[1,1,1,1]];
        this.lights[' '] = [[],[],[],[],[], [], []];
        this.lights['0'] = [[0,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0]];
        this.lights['1'] = [[0,0,1,0],[0,1,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,1,1,1]];
        this.lights['2'] = [[0,1,1,0],[1,0,0,1],[0,0,0,1],[0,0,1,0],[0,1,,0],[1,0,0,0],[1,1,1,1]];
        this.lights['3'] = [[0,1,1,0],[1,0,0,1],[0,0,0,1],[0,1,1,0],[0,0,0,1],[1,0,0,1],[0,1,1,0]];
        this.lights['4'] = [[1,0,0,0],[1,0,0,0],[1,0,1,0],[1,0,1,0],[1,1,1,1],[0,0,1,0],[0,0,1,0]];
        this.lights['5'] = [[1,1,1,1],[1,0,0,0],[1,0,0,0],[1,1,1,0],[0,0,0,1],[1,0,0,1],[0,1,1,0]];
        this.lights['6'] = [[0,1,1,0],[1,0,0,1],[1,0,0,0],[1,1,1,0],[1,0,0,1],[1,0,0,1],[0,1,1,0]];
        this.lights['7'] = [[1,1,1,1],[0,0,0,1],[0,0,0,1],[0,0,1,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]];
        this.lights['8'] = [[0,1,1,0],[1,0,0,1],[1,0,0,1],[0,1,1,0],[1,0,0,1],[1,0,0,1],[0,1,1,0]];
        this.lights['9'] = [[0,1,1,1],[1,0,0,1],[1,0,0,1],[0,1,1,1],[0,0,0,1],[0,0,0,1],[0,0,0,1]];

        // Various config type stuff
        this.properties               = [];
        this.properties['chart.background']     = 'white';
        this.properties['chart.dark']           = '#eee';
        this.properties['chart.light']          = '#f66';
        this.properties['chart.zoom.factor']    = 1.5;
        this.properties['chart.zoom.fade.in']   = true;
        this.properties['chart.zoom.fade.out']  = true;
        this.properties['chart.zoom.hdir']      = 'right';
        this.properties['chart.zoom.vdir']      = 'down';
        this.properties['chart.zoom.frames']    = 10;
        this.properties['chart.zoom.delay']     = 50;
        this.properties['chart.zoom.shadow']    = true;

        // Check for support
        if (!this.canvas) {
            alert('[LED] No canvas support');
            return;
        }
        
        // Check the canvasText library has been included
        if (typeof(RGraph) == 'undefined') {
            alert('[LED] Fatal error: The common library does not appear to have been included');
        }
    }


    /**
    * A setter
    * 
    * @param name  string The name of the property to set
    * @param value mixed  The value of the property
    */
    RGraph.LED.prototype.Set = function (name, value)
    {
        this.properties[name.toLowerCase()] = value;
    }


    /**
    * A getter
    * 
    * @param name  string The name of the property to get
    */
    RGraph.LED.prototype.Get = function (name)
    {
        return this.properties[name.toLowerCase()];
    }


    /**
    * This draws the LEDs
    */
    RGraph.LED.prototype.Draw = function ()
    {
        // First clear the canvas, using the background colour
        RGraph.Clear(this.canvas, this.Get('chart.background'));
        
        for (var l=0; l<this.text.length; l++) {
            this.DrawLetter(this.text.charAt(l), l);
        }
        
        /**
        * Set the title attribute on the canvas
        */
        this.canvas.title = RGraph.rtrim(this.text);

        /**
        * Setup the context menu if required
        */
        RGraph.ShowContext(this);
        
        /**
        * This bit shows the mini zoom window if requested
        */
        RGraph.ShowZoomWindow(this);
    }


    /**
    * Draws a single letter
    * 
    * @param string lights The lights to draw to draw
    * @param int    index  The position of the letter
    */
    RGraph.LED.prototype.DrawLetter = function (letter, index)
    {
        var light    = this.Get('chart.light');
        var dark     = this.Get('chart.dark');
        var lights   = (this.lights[letter] ? this.lights[letter] : [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]]);
        var lwidth   = this.canvas.width / this.text.length;
        var diameter = lwidth / 5;
        var radius   = diameter / 2;

        for (var i=0; i<7; i++) {
            for (var j=0; j<5; j++) {

                var x = (j * diameter) + (index * lwidth) + radius;
                var y = (this.canvas.height / 2) + ((i * diameter) + 2) - (7 * radius);

                // Draw a circle
                this.context.fillStyle   = (lights[i][j] ? light : dark);
                this.context.strokeStyle = (lights[i][j] ? '#ccc' : 'rgba(0,0,0,0)');
                this.context.beginPath();
                this.context.arc(x, y, radius, 0, 6.28, 0);

                this.context.stroke();
                this.context.fill();
            }
        }
    }