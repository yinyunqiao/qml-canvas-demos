 var Vector = function (x, y) {
                    this.x = x || 0;
                    this.y = y || 0;
                };

Vector.prototype = {
    add: function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    },
    length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    rotate: function (theta) {
        var x = this.x;
        var y = this.y;
        this.x = Math.cos(theta) * this.x - Math.sin(theta) * this.y;
        this.y = Math.sin(theta) * this.x + Math.cos(theta) * this.y;
        //this.x = Math.cos(theta) * x - Math.sin(theta) * y;
        //this.y = Math.sin(theta) * x + Math.cos(theta) * y;
        return this;
    },
    mult: function (f) {
        this.x *= f;
        this.y *= f;
        return this;
    }
};

var Leaf = function (p, r, c, ctx) {
    this.p = p || null;
    this.r = r || 0;
    this.c = c || Branch.randomrgba(0, 255, 1);//Qt.rgba(Math.random(),Math.random(),Math.random(),1.0);
    this.ctx = ctx;
}

Leaf.prototype = {
    render: function () {
        var that = this;
        var ctx = this.ctx;
        var f = Branch.random(1, 2)
        for (var i = 0; i < 5; i++) {
            (function (r) {
                //setTimeout(function () {
                    ctx.beginPath();
                    ctx.fillStyle = that.color;
                    ctx.moveTo(that.p.x, that.p.y);
                    //ctx.arc(that.p.x, that.p.y, r, 0, Branch.circle, true);
                    ctx.ellipse(that.p.x, that.p.y, 2*r, 2*r)//0, Branch.circle, true);
                    //ctx.fillRect(that.p.x, that.p.y, r, r);
                    ctx.fill();
               // }, r * 60);
            })(i);
        }
    }
}


var Branch = function (p, v, r, c, t) {
    this.p = p || null;
    this.v = v || null;
    this.r = r || 0;
    this.length = 0;
    this.generation = 1;
    this.tree = t || null;
    this.color = c || Branch.randomrgba(0, 255, 1);////Qt.rgba(Math.random(), Math.random(), Math.random(),1.0);
    this.register();
};

Branch.prototype = {
    register: function () {
        this.tree.addBranch(this);
    },
    draw: function () {
        var ctx = this.tree.ctx;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.moveTo(this.p.x, this.p.y);
        //ctx.arc(this.p.x, this.p.y, this.r, 0, Branch.circle, true);
        ctx.ellipse(this.p.x, this.p.y, 2*this.r, 2*this.r);//0, Branch.circle, true);
        ctx.fill();
        //ctx.fillRect(this.p.x, this.p.y, this.r, this.r);
    },
    modify: function () {
        var angle = 0.18 - (0.10 / this.generation);
        this.p.add(this.v);
        this.length += this.v.length();
        this.r *= 0.99;
        this.v.rotate(Branch.random(-angle, angle)); //.mult(0.996);
        if (this.r < 0.8 || this.generation > 10) {
            this.tree.removeBranch(this);
            var l = new Leaf(this.p, 10, this.color, this.tree.ctx);
            l.render();
        }
    },
    grow: function () {
        this.draw();
        this.modify();
        this.fork();
    },
    fork: function () {
        var p = this.length - Branch.random(100, 200); // + (this.generation * 10);
        if (p > 0) {
            var n = Math.round(Branch.random(1, 3));
            this.tree.stat.fork += n - 1;
            for (var i = 0; i < n; i++) {
                Branch.clone(this);
            }
            this.tree.removeBranch(this);
        }
    }
};

Branch.circle = 2 * Math.PI;
Branch.random = function (min, max) {
    return Math.random() * (max - min) + min;
};
Branch.clone = function (b) {
    var r = new Branch(new Vector(b.p.x, b.p.y), new Vector(b.v.x, b.v.y), b.r, b.color, b.tree);
    r.generation = b.generation + 1;
    return r;
};
Branch.rgba = function (r, g, b, a) {
    return "rgba(" + r + "," + g + "," + b + "," +a + ")";//Qt.rgba(r/255.0,g/255.0,b/255.0,a);
};
Branch.randomrgba = function (min, max, a) {
    return Branch.rgba(Math.round(Branch.random(min, max)), Math.round(Branch.random(min, max)), Math.round(Branch.random(min, max)), a);
};

var Tree = function () {
    var branches = [];
    this.stat = {
        fork: 0,
        length: 0
    };
    this.addBranch = function (b) {
        branches.push(b);
    };
    this.removeBranch = function (b) {
        for (var i = 0; i < branches.length; i++) {
            if (branches[i] === b) {
                branches.splice(i, 1);
                return;
            }
        }
    };
    this.render = function () {
      if (branches.length > 0) {
         for (var i = 0; i < branches.length; i++) {
            branches[i].grow();
         }
      }
      
    };
    this.init = function (ctx) {
        this.ctx = ctx;
    };
    this.abort = function () {
        branches = [];
        this.stat = {
            fork: 0,
            length: 0
        }
    };
    this.finished = function() {
       for (var i = 0; i < branches.length; i++) {
         var b = branches[i];
         if (b.r > 0.8 && b.generation <= 10)
            return false;
       }
       return true;
    }
};

var trees = [];