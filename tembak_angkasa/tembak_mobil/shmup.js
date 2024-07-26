function alert(a) {
    stage.onMouseMove = null;
    bg.onPress = null;
    bg2.onPress = null;
    Ticker.removeListener(tkr);
    tkr = null;
    timerSource = null;
    if (a == "win") {
        win = new Bitmap(winImg);
        win.x = centerX - 64;
        win.y = centerY - 23;
        stage.addChild(win);
        stage.removeChild(enemies, boss)
    } else {
        lose = new Bitmap(loseImg);
        lose.x = centerX - 64;
        lose.y = centerY - 23;
        stage.addChild(lose);
        stage.removeChild(enemies, ship)
    }
    bg.onPress = function() {
        window.location.reload()
    }
    ;
    bg2.onPress = function() {
        window.location.reload()
    }
    ;
    stage.update()
}
function update() {
    bg.y += 5;
    bg2.y += 5;
    if (bg.y >= 480) {
        bg.y = -480
    } else if (bg2.y >= 480) {
        bg2.y = -480
    }
    for (var a = 0; a < bullets.children.length; a++) {
        bullets.children[a].y -= 10;
        if (bullets.children[a].y < -20) {
            bullets.removeChildAt(a)
        }
    }
    if (parseInt(score.text) >= 500 && boss == null) {
        boss = new Bitmap(bImg);
        SoundJS.play("boss");
        boss.x = centerX - 90;
        boss.y = -183;
        stage.addChild(boss);
        Tween.get(boss).to({
            y: 40
        }, 2e3)
    }
    for (var b = 0; b < enemies.children.length; b++) {
        enemies.children[b].y += 5;
        if (enemies.children[b].y > 480 + 50) {
            enemies.removeChildAt(b)
        }
        for (var c = 0; c < bullets.children.length; c++) {
            if (bullets.children[c].x >= enemies.children[b].x && bullets.children[c].x + 11 < enemies.children[b].x + 49 && bullets.children[c].y < enemies.children[b].y + 40) {
                bullets.removeChildAt(c);
                enemies.removeChildAt(b);
                stage.update();
                SoundJS.play("explo");
                score.text = parseFloat(score.text + 50)
            }
            if (boss != null && bullets.children[c].x >= boss.x && bullets.children[c].x + 11 < boss.x + 183 && bullets.children[c].y < boss.y + 162) {
                bullets.removeChildAt(c);
                bossHealth--;
                stage.update();
                SoundJS.play("explo");
                score.text = parseInt(score.text + 50)
            }
        }
        if (enemies.hitTest(ship.x, ship.y) || enemies.hitTest(ship.x + 37, ship.y)) {
            enemies.removeChildAt(b);
            lives.removeChildAt(lives.length);
            ship.y = 480 + 34;
            Tween.get(ship).to({
                y: 425
            }, 500);
            SoundJS.play("explo")
        }
    }
    if (boss != null && bossHealth <= 0) {
        alert("win")
    }
    if (lives.children.length <= 0) {
        alert("lose")
    }
}
function startGame() {
    stage.onMouseMove = moveShip;
    bg.onPress = shoot;
    bg2.onPress = shoot;
    Ticker.addListener(tkr, false);
    tkr.tick = update;
    timerSource = setInterval("addEnemy()", 1e3)
}
function addEnemy() {
    var a = new Bitmap(eImg);
    a.x = Math.floor(Math.random() * (320 - 50));
    a.y = -50;
    enemies.addChild(a);
    stage.update()
}
function shoot() {
    var a = new Bitmap(bltImg);
    a.x = ship.x + 13;
    a.y = ship.y - 20;
    bullets.addChild(a);
    stage.update();
    SoundJS.play("shot")
}
function moveShip(a) {
    ship.x = a.stageX - 18.5
}
function addGameView() {
    ship.x = centerX - 18.5;
    ship.y = 480 + 34;
    for (var a = 0; a < 3; a++) {
        var b = new Bitmap(lImg);
        b.x = 248 + 25 * a;
        b.y = 463;
        lives.addChild(b);
        stage.update()
    }
    score = new Text("0","bold 14px Courier New","#FFFFFF");
    score.maxWidth = 1000;
    score.x = 2;
    score.y = 476;
    bg2.y = -480;
    stage.addChild(bg, bg2, ship, enemies, bullets, lives, score);
    Tween.get(ship).to({
        y: 425
    }, 1e3).call(startGame)
}
function loadGfx(a) {
    if (a.target.name = "bg") {
        bg = new Bitmap(bgImg)
    }
    if (a.target.name = "bg2") {
        bg2 = new Bitmap(bg2Img)
    }
    if (a.target.name = "ship") {
        ship = new Bitmap(sImg)
    }
    gfxLoaded++;
    if (gfxLoaded == 9) {
        addGameView()
    }
}
function Main() {
    canvas = document.getElementById("Shooter");
    stage = new Stage(canvas);
    stage.mouseEventsEnabled = true;
    SoundJS.addBatch([{
        name: "boss",
        src: "boss.mp3",
        instances: 1
    }, {
        name: "explo",
        src: "explo.mp3",
        instances: 10
    }, {
        name: "shot",
        src: "shot.mp3",
        instances: 10
    }]);
    bgImg.src = "bg.png";
    bgImg.name = "bg";
    bgImg.onload = loadGfx;
    bg2Img.src = "bg2.png";
    bg2Img.name = "bg2";
    bg2Img.onload = loadGfx;
    sImg.src = "ship.png";
    sImg.name = "ship";
    sImg.onload = loadGfx;
    eImg.src = "enemy1.png";
    eImg.name = "enemy";
    eImg.onload = loadGfx;
    bImg.src = "boss.png";
    bImg.name = "boss";
    bImg.onload = loadGfx;
    lImg.src = "live.png";
    lImg.name = "live";
    lImg.onload = loadGfx;
    bltImg.src = "bullet.webp";
    bltImg.name = "bullet";
    bltImg.onload = loadGfx;
    winImg.src = "win.png";
    winImg.name = "win";
    winImg.onload = loadGfx;
    loseImg.src = "lose.png";
    loseImg.name = "lose";
    loseImg.onload = loadGfx;
    Ticker.setFPS(30);
    Ticker.addListener(stage)
}
(function(a) {
    UID = function() {
        throw "UID cannot be instantiated"
    }
    ;
    UID._nextID = 0;
    UID.get = function() {
        return UID._nextID++
    }
    ;
    a.UID = UID
}
)(window);
(function(a) {
    Ticker = function() {
        throw "Ticker cannot be instantiated."
    }
    ;
    Ticker._listeners = [];
    Ticker._pauseable = [];
    Ticker._paused = false;
    Ticker._inited = false;
    Ticker._startTime = 0;
    Ticker._pausedTime = 0;
    Ticker._ticks = 0;
    Ticker._pausedTickers = 0;
    Ticker._interval = 50;
    Ticker._intervalID = null;
    Ticker._lastTime = 0;
    Ticker._times = [];
    Ticker.addListener = function(a, b) {
        if (!Ticker._inited) {
            Ticker._inited = true;
            Ticker._startTime = Ticker._getTime();
            Ticker._times.push(0);
            Ticker.setInterval(Ticker._interval)
        }
        this.removeListener(a);
        Ticker._pauseable[Ticker._listeners.length] = b == null ? true : b;
        Ticker._listeners.push(a)
    }
    ;
    Ticker.removeListener = function(a) {
        if (Ticker._listeners != null) {
            a = Ticker._listeners.indexOf(a);
            if (a != -1) {
                Ticker._listeners.splice(a, 1);
                Ticker._pauseable.splice(a, 1)
            }
        }
    }
    ;
    Ticker.removeAllListeners = function() {
        Ticker._listeners = [];
        Ticker._pauseable = []
    }
    ;
    Ticker.setInterval = function(a) {
        Ticker._intervalID != null && clearInterval(Ticker._intervalID);
        Ticker._lastTime = Ticker.getTime(false);
        Ticker._interval = a;
        Ticker._intervalID = setInterval(Ticker._tick, a)
    }
    ;
    Ticker.getInterval = function() {
        return Ticker._interval
    }
    ;
    Ticker.getFPS = function() {
        return 1e3 / Ticker._interval
    }
    ;
    Ticker.setFPS = function(a) {
        Ticker.setInterval(1e3 / a)
    }
    ;
    Ticker.getMeasuredFPS = function(a) {
        if (Ticker._times.length < 2)
            return -1;
        if (a == null)
            a = Ticker.getFPS() >> 1;
        a = Math.min(Ticker._times.length - 1, a);
        return 1e3 / ((Ticker._times[0] - Ticker._times[a]) / a)
    }
    ;
    Ticker.setPaused = function(a) {
        Ticker._paused = a
    }
    ;
    Ticker.getPaused = function() {
        return Ticker._paused
    }
    ;
    Ticker.getTime = function(a) {
        return Ticker._getTime() - Ticker._startTime - (a ? Ticker._pausedTime : 0)
    }
    ;
    Ticker.getTicks = function(a) {
        return Ticker._ticks - (a ? Ticker._pausedTickers : 0)
    }
    ;
    Ticker._tick = function() {
        Ticker._ticks++;
        var a = Ticker.getTime(false)
          , b = a - Ticker._lastTime
          , c = Ticker._paused;
        if (c) {
            Ticker._pausedTickers++;
            Ticker._pausedTime += b
        }
        Ticker._lastTime = a;
        for (var d = Ticker._pauseable, e = Ticker._listeners.slice(), f = e ? e.length : 0, g = 0; g < f; g++) {
            var h = d[g]
              , i = e[g];
            i == null || c && h || i.tick == null || i.tick(b)
        }
        Ticker._times.unshift(a);
        Ticker._times.length > 100 && Ticker._times.pop()
    }
    ;
    Ticker._getTime = function() {
        return (new Date).getTime()
    }
    ;
    a.Ticker = Ticker
}
)(window);
(function(a) {
    MouseEvent = function(a, b, c) {
        this.initialize(a, b, c)
    }
    ;
    var b = MouseEvent.prototype;
    b.stageX = 0;
    b.stageY = 0;
    b.type = null;
    b.nativeEvent = null;
    b.onMouseMove = null;
    b.onMouseUp = null;
    b.initialize = function(a, b, c) {
        this.type = a;
        this.stageX = b;
        this.stageY = c
    }
    ;
    b.clone = function() {
        var a = new MouseEvent(this.type,this.stageX,this.stageY);
        a.nativeEvent = this.nativeEvent;
        return a
    }
    ;
    b.toString = function() {
        return "[MouseEvent (type=" + this.type + " stageX=" + this.stageX + " stageY=" + this.stageY + ")]"
    }
    ;
    a.MouseEvent = MouseEvent
}
)(window);
(function(a) {
    Matrix2D = function(a, b, c, d, e, f) {
        this.initialize(a, b, c, d, e, f)
    }
    ;
    var b = Matrix2D.prototype;
    Matrix2D.identity = null;
    Matrix2D.DEG_TO_RAD = Math.PI / 180;
    b.a = 1;
    b.b = 0;
    b.c = 0;
    b.d = 1;
    b.tx = 0;
    b.ty = 0;
    b.alpha = 1;
    b.shadow = null;
    b.compositeOperation = null;
    b.initialize = function(a, b, c, d, e, f) {
        if (a != null)
            this.a = a;
        if (b != null)
            this.b = b;
        if (c != null)
            this.c = c;
        if (d != null)
            this.d = d;
        if (e != null)
            this.tx = e;
        if (f != null)
            this.ty = f
    }
    ;
    b.prepend = function(a, b, c, d, e, f) {
        var g = this.tx;
        if (a != 1 || b != 0 || c != 0 || d != 1) {
            var h = this.a
              , i = this.c;
            this.a = h * a + this.b * c;
            this.b = h * b + this.b * d;
            this.c = i * a + this.d * c;
            this.d = i * b + this.d * d
        }
        this.tx = g * a + this.ty * c + e;
        this.ty = g * b + this.ty * d + f
    }
    ;
    b.append = function(a, b, c, d, e, f) {
        var g = this.a
          , h = this.b
          , i = this.c
          , j = this.d;
        this.a = a * g + b * i;
        this.b = a * h + b * j;
        this.c = c * g + d * i;
        this.d = c * h + d * j;
        this.tx = e * g + f * i + this.tx;
        this.ty = e * h + f * j + this.ty
    }
    ;
    b.prependMatrix = function(a) {
        this.prepend(a.a, a.b, a.c, a.d, a.tx, a.ty);
        this.prependProperties(a.alpha, a.shadow, a.compositeOperation)
    }
    ;
    b.appendMatrix = function(a) {
        this.append(a.a, a.b, a.c, a.d, a.tx, a.ty);
        this.appendProperties(a.alpha, a.shadow, a.compositeOperation)
    }
    ;
    b.prependTransform = function(a, b, c, d, e, f, g, h, i) {
        if (e % 360) {
            var j = e * Matrix2D.DEG_TO_RAD;
            e = Math.cos(j);
            j = Math.sin(j)
        } else {
            e = 1;
            j = 0
        }
        if (h || i) {
            this.tx -= h;
            this.ty -= i
        }
        if (f || g) {
            f *= Matrix2D.DEG_TO_RAD;
            g *= Matrix2D.DEG_TO_RAD;
            this.prepend(e * c, j * c, -j * d, e * d, 0, 0);
            this.prepend(Math.cos(g), Math.sin(g), -Math.sin(f), Math.cos(f), a, b)
        } else
            this.prepend(e * c, j * c, -j * d, e * d, a, b)
    }
    ;
    b.appendTransform = function(a, b, c, d, e, f, g, h, i) {
        if (e % 360) {
            var j = e * Matrix2D.DEG_TO_RAD;
            e = Math.cos(j);
            j = Math.sin(j)
        } else {
            e = 1;
            j = 0
        }
        if (f || g) {
            f *= Matrix2D.DEG_TO_RAD;
            g *= Matrix2D.DEG_TO_RAD;
            this.append(Math.cos(g), Math.sin(g), -Math.sin(f), Math.cos(f), a, b);
            this.append(e * c, j * c, -j * d, e * d, 0, 0)
        } else
            this.append(e * c, j * c, -j * d, e * d, a, b);
        if (h || i) {
            this.tx -= h * this.a + i * this.c;
            this.ty -= h * this.b + i * this.d
        }
    }
    ;
    b.rotate = function(a) {
        var b = Math.cos(a);
        a = Math.sin(a);
        var c = this.a
          , d = this.c
          , e = this.tx;
        this.a = c * b - this.b * a;
        this.b = c * a + this.b * b;
        this.c = d * b - this.d * a;
        this.d = d * a + this.d * b;
        this.tx = e * b - this.ty * a;
        this.ty = e * a + this.ty * b
    }
    ;
    b.skew = function(a, b) {
        a *= Matrix2D.DEG_TO_RAD;
        b *= Matrix2D.DEG_TO_RAD;
        this.append(Math.cos(b), Math.sin(b), -Math.sin(a), Math.cos(a), 0, 0)
    }
    ;
    b.scale = function(a, b) {
        this.a *= a;
        this.d *= b;
        this.tx *= a;
        this.ty *= b
    }
    ;
    b.translate = function(a, b) {
        this.tx += a;
        this.ty += b
    }
    ;
    b.identity = function() {
        this.alpha = this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;
        this.shadow = this.compositeOperation = null
    }
    ;
    b.invert = function() {
        var a = this.a
          , b = this.b
          , c = this.c
          , d = this.d
          , e = this.tx
          , f = a * d - b * c;
        this.a = d / f;
        this.b = -b / f;
        this.c = -c / f;
        this.d = a / f;
        this.tx = (c * this.ty - d * e) / f;
        this.ty = -(a * this.ty - b * e) / f
    }
    ;
    b.decompose = function(a) {
        if (a == null)
            a = {};
        a.x = this.tx;
        a.y = this.ty;
        a.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
        a.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);
        var b = Math.atan2(-this.c, this.d)
          , c = Math.atan2(this.b, this.a);
        if (b == c) {
            a.rotation = c / Matrix2D.DEG_TO_RAD;
            if (this.a < 0 && this.d >= 0)
                a.rotation += a.rotation <= 0 ? 180 : -180;
            a.skewX = a.skewY = 0
        } else {
            a.skewX = b / Matrix2D.DEG_TO_RAD;
            a.skewY = c / Matrix2D.DEG_TO_RAD
        }
        return a
    }
    ;
    b.appendProperties = function(a, b, c) {
        this.alpha *= a;
        this.shadow = b || this.shadow;
        this.compositeOperation = c || this.compositeOperation
    }
    ;
    b.prependProperties = function(a, b, c) {
        this.alpha *= a;
        this.shadow = this.shadow || b;
        this.compositeOperation = this.compositeOperation || c
    }
    ;
    b.clone = function() {
        var a = new Matrix2D(this.a,this.b,this.c,this.d,this.tx,this.ty);
        a.shadow = this.shadow;
        a.alpha = this.alpha;
        a.compositeOperation = this.compositeOperation;
        return a
    }
    ;
    b.toString = function() {
        return "[Matrix2D (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]"
    }
    ;
    Matrix2D.identity = new Matrix2D(1,0,0,1,0,0);
    a.Matrix2D = Matrix2D
}
)(window);
(function(a) {
    Point = function(a, b) {
        this.initialize(a, b)
    }
    ;
    var b = Point.prototype;
    b.x = 0;
    b.y = 0;
    b.initialize = function(a, b) {
        this.x = a == null ? 0 : a;
        this.y = b == null ? 0 : b
    }
    ;
    b.clone = function() {
        return new Point(this.x,this.y)
    }
    ;
    b.toString = function() {
        return "[Point (x=" + this.x + " y=" + this.y + ")]"
    }
    ;
    a.Point = Point
}
)(window);
(function(a) {
    Rectangle = function(a, b, c, d) {
        this.initialize(a, b, c, d)
    }
    ;
    var b = Rectangle.prototype;
    b.x = 0;
    b.y = 0;
    b.width = 0;
    b.height = 0;
    b.initialize = function(a, b, c, d) {
        this.x = a == null ? 0 : a;
        this.y = b == null ? 0 : b;
        this.width = c == null ? 0 : c;
        this.height = d == null ? 0 : d
    }
    ;
    b.clone = function() {
        return new Rectangle(this.x,this.y,this.width,this.height)
    }
    ;
    b.toString = function() {
        return "[Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + ")]"
    }
    ;
    a.Rectangle = Rectangle
}
)(window);
(function(a) {
    Shadow = function(a, b, c, d) {
        this.initialize(a, b, c, d)
    }
    ;
    var b = Shadow.prototype;
    Shadow.identity = null;
    b.color = null;
    b.offsetX = 0;
    b.offsetY = 0;
    b.blur = 0;
    b.initialize = function(a, b, c, d) {
        this.color = a;
        this.offsetX = b;
        this.offsetY = c;
        this.blur = d
    }
    ;
    b.toString = function() {
        return "[Shadow]"
    }
    ;
    b.clone = function() {
        return new Shadow(this.color,this.offsetX,this.offsetY,this.blur)
    }
    ;
    Shadow.identity = new Shadow(null,0,0,0);
    a.Shadow = Shadow
}
)(window);
(function(a) {
    SpriteSheet = function(a, b, c, d) {
        this.initialize(a, b, c, d)
    }
    ;
    var b = SpriteSheet.prototype;
    b.image = null;
    b.frameWidth = 0;
    b.frameHeight = 0;
    b.frameData = null;
    b.loop = true;
    b.totalFrames = 0;
    b.initialize = function(a, b, c, d) {
        this.image = a;
        this.frameWidth = b;
        this.frameHeight = c;
        this.frameData = d
    }
    ;
    b.toString = function() {
        return "[SpriteSheet]"
    }
    ;
    b.clone = function() {
        var a = new SpriteSheet(this.image,this.frameWidth,this.frameHeight,this.frameData);
        a.loop = this.loop;
        a.totalFrames = this.totalFrames;
        return a
    }
    ;
    a.SpriteSheet = SpriteSheet
}
)(window);
(function(l) {
    function b(a, b) {
        this.f = a;
        this.params = b
    }
    b.prototype.exec = function(a) {
        this.f.apply(a, this.params)
    }
    ;
    Graphics = function(a) {
        this.initialize(a)
    }
    ;
    var a = Graphics.prototype;
    Graphics.getRGB = function(a, b, c, d) {
        if (a != null && c == null) {
            d = b;
            c = a & 255;
            b = a >> 8 & 255;
            a = a >> 16 & 255
        }
        return d == null ? "rgb(" + a + "," + b + "," + c + ")" : "rgba(" + a + "," + b + "," + c + "," + d + ")"
    }
    ;
    Graphics.getHSL = function(a, b, c, d) {
        return d == null ? "hsl(" + a % 360 + "," + b + "%," + c + "%)" : "hsla(" + a % 360 + "," + b + "%," + c + "%," + d + ")"
    }
    ;
    Graphics.STROKE_CAPS_MAP = ["butt", "round", "square"];
    Graphics.STROKE_JOINTS_MAP = ["miter", "round", "bevel"];
    Graphics._ctx = document.createElement("canvas").getContext("2d");
    Graphics.beginCmd = new b(Graphics._ctx.beginPath,[]);
    Graphics.fillCmd = new b(Graphics._ctx.fill,[]);
    Graphics.strokeCmd = new b(Graphics._ctx.stroke,[]);
    a._strokeInstructions = null;
    a._strokeStyleInstructions = null;
    a._fillInstructions = null;
    a._instructions = null;
    a._oldInstructions = null;
    a._activeInstructions = null;
    a._active = false;
    a._dirty = false;
    a._minX = NaN;
    a._minY = NaN;
    a._maxX = NaN;
    a._maxY = NaN;
    a._boundsQueue = null;
    a._x = 0;
    a._y = 0;
    a.initialize = function(c) {
        this.clear();
        this._ctx = Graphics._ctx;
        with (this)
            eval(c)
    }
    ;
    a.draw = function(a) {
        this._dirty && this._updateInstructions();
        for (var b = this._instructions, c = 0, d = b.length; c < d; c++)
            b[c].exec(a)
    }
    ;
    a.getBounds = function() {
        this._boundsQueue.length && this._updateBounds();
        return isNaN(this._minX) ? null : new Rectangle(this._minX,this._minY,this._maxX - this._minX,this._maxY - this._minY)
    }
    ;
    a.moveTo = function(a, c) {
        this._activeInstructions.push(new b(this._ctx.moveTo,[a, c]));
        this._x = a;
        this._y = c;
        return this
    }
    ;
    a.lineTo = function(a, c) {
        this._dirty = this._active = true;
        this._activeInstructions.push(new b(this._ctx.lineTo,[a, c]));
        this._extendBounds(this._x, this._y);
        this._extendBounds(a, c);
        this._x = a;
        this._y = c;
        return this
    }
    ;
    a.arcTo = function(a, c, d, e, f) {
        this._dirty = this._active = true;
        this._activeInstructions.push(new b(this._ctx.arcTo,[a, c, d, e, f]));
        return this
    }
    ;
    a.arc = function(a, c, d, e, f, g) {
        this._dirty = this._active = true;
        if (g == null)
            g = false;
        this._activeInstructions.push(new b(this._ctx.arc,[a, c, d, e, f, g]));
        return this
    }
    ;
    a.quadraticCurveTo = function(a, c, d, e) {
        this._dirty = this._active = true;
        this._activeInstructions.push(new b(this._ctx.quadraticCurveTo,[a, c, d, e]));
        return this
    }
    ;
    a.bezierCurveTo = function(a, c, d, e, f, g) {
        this._dirty = this._active = true;
        this._activeInstructions.push(new b(this._ctx.bezierCurveTo,[a, c, d, e, f, g]));
        this._boundsQueue.push(new b(this._bezierCurveToBounds,[_x, _y, a, c, d, e, f, g]));
        return this
    }
    ;
    a.rect = function(a, c, d, e) {
        this._dirty = this._active = true;
        this._activeInstructions.push(new b(this._ctx.rect,[a, c, d - 1, e]));
        this._extendBounds(a, c);
        this._extendBounds(a + d, c + e);
        return this
    }
    ;
    a.closePath = function() {
        if (this._active) {
            this._dirty = true;
            this._activeInstructions.push(new b(this._ctx.closePath,[]))
        }
        return this
    }
    ;
    a.clear = function() {
        this._instructions = [];
        this._oldInstructions = [];
        this._activeInstructions = [];
        this._strokeStyleInstructions = this._strokeInstructions = this._fillInstructions = null;
        this._active = this._dirty = false;
        this._boundsQueue = [];
        this._minX = this._minY = this._maxX = this._maxY = NaN;
        return this
    }
    ;
    a.beginFill = function(a) {
        this._active && this._newPath();
        this._fillInstructions = a ? [new b(this._setProp,["fillStyle", a])] : null;
        return this
    }
    ;
    a.beginLinearGradientFill = function(a, c, d, e, f, g) {
        this._active && this._newPath();
        d = this._ctx.createLinearGradient(d, e, f, g);
        e = 0;
        for (f = a.length; e < f; e++)
            d.addColorStop(c[e], a[e]);
        this._fillInstructions = [new b(this._setProp,["fillStyle", d])];
        return this
    }
    ;
    a.beginRadialGradientFill = function(a, c, d, e, f, g, h, i) {
        this._active && this._newPath();
        d = this._ctx.createRadialGradient(d, e, f, g, h, i);
        e = 0;
        for (f = a.length; e < f; e++)
            d.addColorStop(c[e], a[e]);
        this._fillInstructions = [new b(this._setProp,["fillStyle", d])];
        return this
    }
    ;
    a.beginBitmapFill = function(a, c) {
        this._active && this._newPath();
        var d = this._ctx.createPattern(a, c || "");
        this._fillInstructions = [new b(this._setProp,["fillStyle", d])];
        return this
    }
    ;
    a.endFill = function() {
        this.beginFill(null);
        return this
    }
    ;
    a.setStrokeStyle = function(a, c, d, e) {
        this._active && this._newPath();
        this._strokeStyleInstructions = [new b(this._setProp,["lineWidth", a == null ? "1" : a]), new b(this._setProp,["lineCap", c == null ? "butt" : isNaN(c) ? c : Graphics.STROKE_CAPS_MAP[c]]), new b(this._setProp,["lineJoin", d == null ? "miter" : isNaN(d) ? d : Graphics.STROKE_JOINTS_MAP[d]]), new b(this._setProp,["miterLimit", e == null ? "10" : e])];
        return this
    }
    ;
    a.beginStroke = function(a) {
        this._active && this._newPath();
        this._strokeInstructions = a ? [new b(this._setProp,["strokeStyle", a])] : null;
        return this
    }
    ;
    a.beginLinearGradientStroke = function(a, c, d, e, f, g) {
        this._active && this._newPath();
        d = this._ctx.createLinearGradient(d, e, f, g);
        e = 0;
        for (f = a.length; e < f; e++)
            d.addColorStop(c[e], a[e]);
        this._strokeInstructions = [new b(this._setProp,["strokeStyle", d])];
        return this
    }
    ;
    a.beginRadialGradientStroke = function(a, c, d, e, f, g, h, i) {
        this._active && this._newPath();
        d = this._ctx.createRadialGradient(d, e, f, g, h, i);
        e = 0;
        for (f = a.length; e < f; e++)
            d.addColorStop(c[e], a[e]);
        this._strokeInstructions = [new b(this._setProp,["strokeStyle", d])];
        return this
    }
    ;
    a.beginBitmapStroke = function(a, c) {
        this._active && this._newPath();
        var d = this._ctx.createPattern(a, c || "");
        this._strokeInstructions = [new b(this._setProp,["strokeStyle", d])];
        return this
    }
    ;
    a.endStroke = function() {
        this.beginStroke(null);
        return this
    }
    ;
    a.curveTo = a.quadraticCurveTo;
    a.drawRect = a.rect;
    a.drawRoundRect = function(a, b, c, d, e) {
        this.drawRoundRectComplex(a, b, c, d, e, e, e, e);
        return this
    }
    ;
    a.drawRoundRectComplex = function(a, c, d, e, f, g, h, i) {
        this._dirty = this._active = true;
        this._activeInstructions.push(new b(this._ctx.moveTo,[a + f, c]), new b(this._ctx.lineTo,[a + d - g, c]), new b(this._ctx.arc,[a + d - g, c + g, g, -Math.PI / 2, 0, false]), new b(this._ctx.lineTo,[a + d, c + e - h]), new b(this._ctx.arc,[a + d - h, c + e - h, h, 0, Math.PI / 2, false]), new b(this._ctx.lineTo,[a + i, c + e]), new b(this._ctx.arc,[a + i, c + e - i, i, Math.PI / 2, Math.PI, false]), new b(this._ctx.lineTo,[a, c + f]), new b(this._ctx.arc,[a + f, c + f, f, Math.PI, Math.PI * 3 / 2, false]));
        return this
    }
    ;
    a.drawCircle = function(a, b, c) {
        this.arc(a, b, c, 0, Math.PI * 2);
        return this
    }
    ;
    a.drawEllipse = function(a, c, d, e) {
        this._dirty = this._active = true;
        var f = d / 2 * .5522848
          , g = e / 2 * .5522848
          , h = a + d
          , i = c + e;
        d = a + d / 2;
        e = c + e / 2;
        this._activeInstructions.push(new b(this._ctx.moveTo,[a, e]), new b(this._ctx.bezierCurveTo,[a, e - g, d - f, c, d, c]), new b(this._ctx.bezierCurveTo,[d + f, c, h, e - g, h, e]), new b(this._ctx.bezierCurveTo,[h, e + g, d + f, i, d, i]), new b(this._ctx.bezierCurveTo,[d - f, i, a, e + g, a, e]));
        return this
    }
    ;
    a.drawPolyStar = function(a, c, d, e, f, g) {
        this._dirty = this._active = true;
        if (f == null)
            f = 0;
        f = 1 - f;
        if (g == null)
            g = 0;
        else
            g /= 180 / Math.PI;
        var h = Math.PI / e;
        this._activeInstructions.push(new b(this._ctx.moveTo,[a + Math.cos(g) * d, c + Math.sin(g) * d]));
        for (var i = 0; i < e; i++) {
            g += h;
            f != 1 && this._activeInstructions.push(new b(this._ctx.lineTo,[a + Math.cos(g) * d * f, c + Math.sin(g) * d * f]));
            g += h;
            this._activeInstructions.push(new b(this._ctx.lineTo,[a + Math.cos(g) * d, c + Math.sin(g) * d]))
        }
        return this
    }
    ;
    a.clone = function() {
        var a = new Graphics;
        a._instructions = this._instructions.slice();
        a._activeInstructions = this._activeInstructions.slice();
        a._oldInstructions = this._oldInstructions.slice();
        if (this._fillInstructions)
            a._fillInstructions = this._fillInstructions.slice();
        if (this._strokeInstructions)
            a._strokeInstructions = this._strokeInstructions.slice();
        if (this._strokeStyleInstructions)
            a._strokeStyleInstructions = this._strokeStyleInstructions.slice();
        a._active = this._active;
        a._dirty = this._dirty;
        return a
    }
    ;
    a.toString = function() {
        return "[Graphics]"
    }
    ;
    a.mt = a.moveTo;
    a.lt = a.lineTo;
    a.at = a.arcTo;
    a.bt = a.bezierCurveTo;
    a.qt = a.quadraticCurveTo;
    a.a = a.arc;
    a.r = a.rect;
    a.cp = a.closePath;
    a.c = a.clear;
    a.f = a.beginFill;
    a.lf = a.beginLinearGradientFill;
    a.rf = a.beginRadialGradientFill;
    a.bf = a.beginBitmapFill;
    a.ef = a.endFill;
    a.ss = a.setStrokeStyle;
    a.s = a.beginStroke;
    a.ls = a.beginLinearGradientStroke;
    a.rs = a.beginRadialGradientStroke;
    a.bs = a.beginBitmapStroke;
    a.es = a.endStroke;
    a.dr = a.drawRect;
    a.rr = a.drawRoundRect;
    a.rc = a.drawRoundRectComplex;
    a.dc = a.drawCircle;
    a.de = a.drawEllipse;
    a.dp = a.drawPolyStar;
    a._updateInstructions = function() {
        this._instructions = this._oldInstructions.slice();
        this._instructions.push(Graphics.beginCmd);
        this._fillInstructions && this._instructions.push.apply(this._instructions, this._fillInstructions);
        if (this._strokeInstructions) {
            this._instructions.push.apply(this._instructions, this._strokeInstructions);
            this._strokeStyleInstructions && this._instructions.push.apply(this._instructions, this._strokeStyleInstructions)
        }
        this._instructions.push.apply(this._instructions, this._activeInstructions);
        this._fillInstructions && this._instructions.push(Graphics.fillCmd);
        this._strokeInstructions && this._instructions.push(Graphics.strokeCmd)
    }
    ;
    a._newPath = function() {
        this._dirty && this._updateInstructions();
        this._oldInstructions = this._instructions;
        this._activeInstructions = [];
        this._active = this._dirty = false
    }
    ;
    a._setProp = function(a, b) {
        this[a] = b
    }
    ;
    a._extendBounds = function(a, b) {
        if (isNaN(this._minX)) {
            this._minX = this._maxX = a;
            this._minY = this._maxY = b
        } else {
            if (a < this._minX)
                this._minX = a;
            else if (a > this._maxX)
                this._maxX = a;
            if (b < this._minY)
                this._minY = b;
            else if (b > this._maxY)
                this._maxY = b
        }
    }
    ;
    a._updateBounds = function() {
        for (; boundsQueue.length; )
            boundsQueue.pop().exec(this)
    }
    ;
    a._bezierCurveToBounds = function(a, b, c, d, e, f, g, h) {
        this._extendBounds(a, b);
        this._extendBounds(g, h)
    }
    ;
    l.Graphics = Graphics
}
)(window);
(function(a) {
    DisplayObject = function() {
        this.initialize()
    }
    ;
    var b = DisplayObject.prototype;
    DisplayObject.suppressCrossDomainErrors = false;
    DisplayObject._hitTestCanvas = document.createElement("canvas");
    DisplayObject._hitTestCanvas.width = DisplayObject._hitTestCanvas.height = 1;
    DisplayObject._hitTestContext = DisplayObject._hitTestCanvas.getContext("2d");
    DisplayObject._workingMatrix = new Matrix2D;
    b.alpha = 1;
    b.cacheCanvas = null;
    b.id = -1;
    b.mouseEnabled = true;
    b.name = null;
    b.parent = null;
    b.regX = 0;
    b.regY = 0;
    b.rotation = 0;
    b.scaleX = 1;
    b.scaleY = 1;
    b.skewX = 0;
    b.skewY = 0;
    b.shadow = null;
    b.visible = true;
    b.x = 0;
    b.y = 0;
    b.compositeOperation = null;
    b.snapToPixel = false;
    b.onPress = null;
    b.onClick = null;
    b.onDoubleClick = null;
    b.onMouseOver = null;
    b.onMouseOut = null;
    b.filters = null;
    b.clipRect = null;
    b._cacheOffsetX = 0;
    b._cacheOffsetY = 0;
    b._cacheDraw = false;
    b._activeContext = null;
    b._restoreContext = false;
    b._revertShadow = false;
    b._revertX = 0;
    b._revertY = 0;
    b._revertAlpha = 1;
    b._minX = NaN;
    b._minY = NaN;
    b._maxX = NaN;
    b._maxY = NaN;
    b.initialize = function() {
        this.id = UID.get();
        this.children = []
    }
    ;
    b.isVisible = function() {
        return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0
    }
    ;
    b.draw = function(a, b) {
        if (b || !this.cacheCanvas)
            return false;
        a.drawImage(this.cacheCanvas, this._cacheOffsetX, this._cacheOffsetY);
        return true
    }
    ;
    b.cache = function(a, b, c, d) {
        if (this.cacheCanvas == null)
            this.cacheCanvas = document.createElement("canvas");
        var e = this.cacheCanvas.getContext("2d");
        this.cacheCanvas.width = c;
        this.cacheCanvas.height = d;
        e.setTransform(1, 0, 0, 1, 0, 0);
        e.clearRect(0, 0, c + 1, d + 1);
        this.draw(e, true, new Matrix2D(1,0,0,1,-a,-b));
        this._cacheOffsetX = a;
        this._cacheOffsetY = b;
        this._applyFilters()
    }
    ;
    b.updateCache = function(a) {
        if (this.cacheCanvas == null)
            throw "cache() must be called before updateCache()";
        var b = this.cacheCanvas.getContext("2d");
        b.setTransform(1, 0, 0, 1, -this._cacheOffsetX, -this._cacheOffsetY);
        if (a)
            b.globalCompositeOperation = a;
        else
            b.clearRect(0, 0, this.cacheCanvas.width + 1, this.cacheCanvas.height + 1);
        this.draw(b, true);
        if (a)
            b.globalCompositeOperation = "source-over";
        this._applyFilters()
    }
    ;
    b.uncache = function() {
        this.cacheCanvas = null;
        this._cacheOffsetX = this._cacheOffsetY = 0
    }
    ;
    b.getStage = function() {
        for (var a = this; a.parent; )
            a = a.parent;
        if (a instanceof Stage)
            return a;
        return null
    }
    ;
    b.localToGlobal = function(a, b) {
        var c = this.getConcatenatedMatrix();
        if (c == null)
            return null;
        c.append(1, 0, 0, 1, a, b);
        return new Point(c.tx,c.ty)
    }
    ;
    b.globalToLocal = function(a, b) {
        var c = this.getConcatenatedMatrix();
        if (c == null)
            return null;
        c.invert();
        c.append(1, 0, 0, 1, a, b);
        return new Point(c.tx,c.ty)
    }
    ;
    b.localToLocal = function(a, b, c) {
        a = this.localToGlobal(a, b);
        return c.globalToLocal(a.x, a.y)
    }
    ;
    b.setTransform = function(a, b, c, d, e, f, g, h, i) {
        this.x = a || 0;
        this.y = b || 0;
        this.scaleX = c == null ? 1 : c;
        this.scaleY = d == null ? 1 : d;
        this.rotation = e || 0;
        this.skewX = f || 0;
        this.skewY = g || 0;
        this.regX = h || 0;
        this.regY = i || 0
    }
    ;
    b.getConcatenatedMatrix = function(a) {
        if (a)
            a.identity();
        else
            a = new Matrix2D;
        for (var b = this; b != null; ) {
            a.prependTransform(b.x, b.y, b.scaleX, b.scaleY, b.rotation, b.skewX, b.skewY, b.regX, b.regY);
            a.prependProperties(b.alpha, b.shadow, b.compositeOperation);
            b = b.parent
        }
        return a
    }
    ;
    b.hitTest = function(a, b) {
        var c = DisplayObject._hitTestContext
          , d = DisplayObject._hitTestCanvas;
        c.setTransform(1, 0, 0, 1, -a, -b);
        this.draw(c);
        c = this._testHit(c);
        d.width = 0;
        d.width = 1;
        return c
    }
    ;
    b.getBounds = function() {
        return this._cacheCanvas ? new Rectangle(-this._cacheOffsetX,-this._cacheOffsetY,this.cacheCanvas.width,this.cacheCanvas.height) : this._calculateBounds()
    }
    ;
    b.clone = function() {
        var a = new DisplayObject;
        this.cloneProps(a);
        return a
    }
    ;
    b.toString = function() {
        return "[DisplayObject (name=" + this.name + ")]"
    }
    ;
    b.cloneProps = function(a) {
        a.alpha = this.alpha;
        a.name = this.name;
        a.regX = this.regX;
        a.regY = this.regY;
        a.rotation = this.rotation;
        a.scaleX = this.scaleX;
        a.scaleY = this.scaleY;
        a.shadow = this.shadow;
        a.skewX = this.skewX;
        a.skewY = this.skewY;
        a.visible = this.visible;
        a.x = this.x;
        a.y = this.y;
        a.mouseEnabled = this.mouseEnabled;
        a.compositeOperation = this.compositeOperation
    }
    ;
    b.applyShadow = function(a, b) {
        b = b || Shadow.identity;
        a.shadowColor = b.color;
        a.shadowOffsetX = b.offsetX;
        a.shadowOffsetY = b.offsetY;
        a.shadowBlur = b.blur
    }
    ;
    b._testHit = function(a) {
        try {
            var b = a.getImageData(0, 0, 1, 1).data[3] > 1
        } catch (c) {
            if (!DisplayObject.suppressCrossDomainErrors)
                throw "An error has occured. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images."
        }
        return b
    }
    ;
    b._applyFilters = function() {
        if (!(!this.filters || this.filters.length == 0 || !this.cacheCanvas))
            for (var a = this.filters.length, b = this.cacheCanvas.getContext("2d"), c = this.cacheCanvas.width, d = this.cacheCanvas.height, e = 0; e < a; e++)
                this.filters[e].applyFilter(b, 0, 0, c, d)
    }
    ;
    b._calculateBounds = function() {
        return new Rectangle(0,0,0,0)
    }
    ;
    a.DisplayObject = DisplayObject
}
)(window);
(function(a) {
    Container = function() {
        this.initialize()
    }
    ;
    var b = Container.prototype = new DisplayObject;
    b.children = null;
    b.DisplayObject_initialize = b.initialize;
    b.initialize = function() {
        this.DisplayObject_initialize();
        this.children = []
    }
    ;
    b.isVisible = function() {
        return this.visible && this.alpha > 0 && this.children.length && this.scaleX != 0 && this.scaleY != 0
    }
    ;
    b.DisplayObject_draw = b.draw;
    b.draw = function(a, b, c) {
        var d = Stage._snapToPixelEnabled;
        if (!c) {
            c = new Matrix2D;
            c.appendProperties(this.alpha, this.shadow, this.compositeOperation)
        }
        if (this.DisplayObject_draw(a, b))
            return true;
        b = this.children.length;
        for (var e = this.children.slice(0), f = 0; f < b; f++) {
            var g = e[f];
            g.tick && g.tick();
            if (g.isVisible()) {
                var h = false
                  , i = c.clone();
                i.appendTransform(g.x, g.y, g.scaleX, g.scaleY, g.rotation, g.skewX, g.skewY, g.regX, g.regY);
                i.appendProperties(g.alpha, g.shadow, g.compositeOperation);
                if (!(g instanceof Container && g.cacheCanvas == null)) {
                    d && g.snapToPixel && i.a == 1 && i.b == 0 && i.c == 0 && i.d == 1 ? a.setTransform(i.a, i.b, i.c, i.d, i.tx + .5 | 0, i.ty + .5 | 0) : a.setTransform(i.a, i.b, i.c, i.d, i.tx, i.ty);
                    a.globalAlpha = i.alpha;
                    a.globalCompositeOperation = i.compositeOperation || "source-over";
                    if (h = i.shadow)
                        this.applyShadow(a, h)
                }
                g.draw(a, false, i);
                h && this.applyShadow(a)
            }
        }
        return true
    }
    ;
    b.addChild = function(a) {
        var b = arguments.length;
        if (b > 1) {
            for (var c = 0; c < b; c++)
                this.addChild(arguments[c]);
            return arguments[b - 1]
        }
        a.parent && a.parent.removeChild(a);
        a.parent = this;
        this.children.push(a);
        return a
    }
    ;
    b.addChildAt = function(a, b) {
        var c = arguments.length;
        if (c > 2) {
            b = arguments[d - 1];
            for (var d = 0; d < c - 1; d++)
                this.addChildAt(arguments[d], b + d);
            return arguments[c - 2]
        }
        a.parent && a.parent.removeChild(a);
        a.parent = this;
        this.children.splice(b, 0, a);
        return a
    }
    ;
    b.removeChild = function(a) {
        var b = arguments.length;
        if (b > 1) {
            for (var c = true, d = 0; d < b; d++)
                c = c && this.removeChild(arguments[d]);
            return c
        }
        return this.removeChildAt(this.children.indexOf(a))
    }
    ;
    b.removeChildAt = function(a) {
        var b = arguments.length;
        if (b > 1) {
            for (var c = [], d = 0; d < b; d++)
                c[d] = arguments[d];
            c.sort(function(a, b) {
                return b - a
            });
            var e = true;
            for (d = 0; d < b; d++)
                e = e && this.removeChildAt(c[d]);
            return e
        }
        if (a < 0 || a > this.children.length - 1)
            return false;
        b = this.children[a];
        if (b != null)
            b.parent = null;
        this.children.splice(a, 1);
        return true
    }
    ;
    b.removeAllChildren = function() {
        for (; this.children.length; )
            this.removeChildAt(0)
    }
    ;
    b.getChildAt = function(a) {
        return this.children[a]
    }
    ;
    b.sortChildren = function(a) {
        this.children.sort(a)
    }
    ;
    b.getChildIndex = function(a) {
        return this.children.indexOf(a)
    }
    ;
    b.getNumChildren = function() {
        return this.children.length
    }
    ;
    b.contains = function(a) {
        for (; a; ) {
            if (a == this)
                return true;
            a = a.parent
        }
        return false
    }
    ;
    b.hitTest = function(a, b) {
        return this.getObjectUnderPoint(a, b) != null
    }
    ;
    b.getObjectsUnderPoint = function(a, b) {
        var c = []
          , d = this.localToGlobal(a, b);
        this._getObjectsUnderPoint(d.x, d.y, c);
        return c
    }
    ;
    b.getObjectUnderPoint = function(a, b) {
        var c = this.localToGlobal(a, b);
        return this._getObjectsUnderPoint(c.x, c.y)
    }
    ;
    b.clone = function(a) {
        var b = new Container;
        this.cloneProps(b);
        if (a)
            for (var c = b.children = [], d = 0, e = this.children.length; d < e; d++)
                c.push(this.children[d].clone(a));
        return b
    }
    ;
    b.toString = function() {
        return "[Container (name=" + this.name + ")]"
    }
    ;
    b._getObjectsUnderPoint = function(a, b, c, d) {
        var e = DisplayObject._hitTestContext
          , f = DisplayObject._hitTestCanvas
          , g = DisplayObject._workingMatrix
          , h = d & 1 && (this.onPress || this.onClick || this.onDoubleClick) || d & 2 && (this.onMouseOver || this.onMouseOut);
        if (this.cacheCanvas) {
            this.getConcatenatedMatrix(g);
            e.setTransform(g.a, g.b, g.c, g.d, g.tx - a, g.ty - b);
            e.globalAlpha = g.alpha;
            this.draw(e);
            if (this._testHit(e)) {
                f.width = 0;
                f.width = 1;
                if (h)
                    return this
            } else
                return null
        }
        for (var i = this.children.length - 1; i >= 0; i--) {
            var j = this.children[i];
            if (j.isVisible() && j.mouseEnabled)
                if (j instanceof Container)
                    if (h) {
                        if (j = j._getObjectsUnderPoint(a, b))
                            return this
                    } else {
                        j = j._getObjectsUnderPoint(a, b, c, d);
                        if (!c && j)
                            return j
                    }
                else if (!d || h || d & 1 && (j.onPress || j.onClick || j.onDoubleClick) || d & 2 && (j.onMouseOver || j.onMouseOut)) {
                    j.getConcatenatedMatrix(g);
                    e.setTransform(g.a, g.b, g.c, g.d, g.tx - a, g.ty - b);
                    e.globalAlpha = g.alpha;
                    j.draw(e);
                    if (this._testHit(e)) {
                        f.width = 0;
                        f.width = 1;
                        if (h)
                            return this;
                        else if (c)
                            c.push(j);
                        else
                            return j
                    }
                }
        }
        return null
    }
    ;
    b._calculateBounds = function() {}
    ;
    a.Container = Container
}
)(window);
(function(a) {
    Stage = function(a) {
        this.initialize(a)
    }
    ;
    var b = Stage.prototype = new Container;
    Stage._snapToPixelEnabled = false;
    b.autoClear = true;
    b.canvas = null;
    b.mouseX = null;
    b.mouseY = null;
    b.onMouseMove = null;
    b.onMouseUp = null;
    b.onMouseDown = null;
    b.snapToPixelEnabled = false;
    b.mouseInBounds = false;
    b._tmpCanvas = null;
    b._activeMouseEvent = null;
    b._activeMouseTarget = null;
    b._mouseOverIntervalID = null;
    b._mouseOverX = 0;
    b._mouseOverY = 0;
    b._mouseOverTarget = null;
    b.Container_initialize = b.initialize;
    b.initialize = function(b) {
        this.Container_initialize();
        this.canvas = b;
        this.mouseChildren = true;
        var c = this;
        if (a.addEventListener) {
            a.addEventListener("mouseup", function(a) {
                c._handleMouseUp(a)
            }, false);
            a.addEventListener("mousemove", function(a) {
                c._handleMouseMove(a)
            }, false);
            a.addEventListener("dblclick", function(a) {
                c._handleDoubleClick(a)
            }, false)
        } else if (document.addEventListener) {
            document.addEventListener("mouseup", function(a) {
                c._handleMouseUp(a)
            }, false);
            document.addEventListener("mousemove", function(a) {
                c._handleMouseMove(a)
            }, false);
            document.addEventListener("dblclick", function(a) {
                c._handleDoubleClick(a)
            }, false)
        }
        b.addEventListener("mousedown", function(a) {
            c._handleMouseDown(a)
        }, false)
    }
    ;
    b.update = function() {
        if (this.canvas) {
            this.autoClear && this.clear();
            Stage._snapToPixelEnabled = this.snapToPixelEnabled;
            this.draw(this.canvas.getContext("2d"), false, this.getConcatenatedMatrix(DisplayObject._workingMatrix))
        }
    }
    ;
    b.tick = b.update;
    b.clear = function() {
        if (this.canvas) {
            var a = this.canvas.getContext("2d");
            a.setTransform(1, 0, 0, 1, 0, 0);
            a.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }
    }
    ;
    b.toDataURL = function(a, b) {
        b || (b = "image/png");
        var c = this.canvas.getContext("2d"), d = this.canvas.width, e = this.canvas.height, f;
        if (a) {
            f = c.getImageData(0, 0, d, e);
            var g = c.globalCompositeOperation;
            c.globalCompositeOperation = "destination-over";
            c.fillStyle = a;
            c.fillRect(0, 0, d, e)
        }
        var h = this.canvas.toDataURL(b);
        if (a) {
            c.clearRect(0, 0, d, e);
            c.putImageData(f, 0, 0);
            c.globalCompositeOperation = g
        }
        return h
    }
    ;
    b.enableMouseOver = function(a) {
        if (this._mouseOverIntervalID) {
            clearInterval(this._mouseOverIntervalID);
            this._mouseOverIntervalID = null
        }
        if (!(a <= 0)) {
            var b = this;
            this._mouseOverIntervalID = setInterval(function() {
                b._testMouseOver()
            }, 1e3 / Math.min(50, a));
            this._mouseOverX = NaN;
            this._mouseOverTarget = null
        }
    }
    ;
    b.clone = function() {
        var a = new Stage(null);
        this.cloneProps(a);
        return a
    }
    ;
    b.toString = function() {
        return "[Stage (name=" + this.name + ")]"
    }
    ;
    b._handleMouseMove = function(b) {
        if (this.canvas) {
            if (!b)
                b = a.event;
            var c = this.mouseInBounds;
            this._updateMousePosition(b.pageX, b.pageY);
            if (c || this.mouseInBounds) {
                c = new MouseEvent("onMouseMove",this.mouseX,this.mouseY);
                c.nativeEvent = b;
                if (this.onMouseMove)
                    this.onMouseMove(c);
                if (this._activeMouseEvent && this._activeMouseEvent.onMouseMove)
                    this._activeMouseEvent.onMouseMove(c)
            }
        } else
            this.mouseX = this.mouseY = null
    }
    ;
    b._updateMousePosition = function(a, b) {
        var c = this.canvas;
        do {
            a -= c.offsetLeft;
            b -= c.offsetTop
        } while (c = c.offsetParent);
        if (this.mouseInBounds = a >= 0 && b >= 0 && a < this.canvas.width && b < this.canvas.height) {
            this.mouseX = a;
            this.mouseY = b
        }
    }
    ;
    b._handleMouseUp = function(a) {
        var b = new MouseEvent("onMouseUp",this.mouseX,this.mouseY);
        b.nativeEvent = a;
        if (this.onMouseUp)
            this.onMouseUp(b);
        if (this._activeMouseEvent && this._activeMouseEvent.onMouseUp)
            this._activeMouseEvent.onMouseUp(b);
        if (this._activeMouseTarget && this._activeMouseTarget.onClick && this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, true, this._mouseOverIntervalID ? 3 : 1) == this._activeMouseTarget) {
            b = new MouseEvent("onClick",this.mouseX,this.mouseY);
            b.nativeEvent = a;
            this._activeMouseTarget.onClick(b)
        }
        this._activeMouseEvent = this.activeMouseTarget = null
    }
    ;
    b._handleMouseDown = function(a) {
        var b;
        if (this.onMouseDown) {
            b = new MouseEvent("onMouseDown",this.mouseX,this.mouseY);
            b.nativeEvent = a;
            this.onMouseDown(b)
        }
        var c = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, this._mouseOverIntervalID ? 3 : 1);
        if (c) {
            if (c.onPress instanceof Function) {
                b = new MouseEvent("onPress",this.mouseX,this.mouseY);
                b.nativeEvent = a;
                c.onPress(b);
                if (b.onMouseMove || b.onMouseUp)
                    this._activeMouseEvent = b
            }
            this._activeMouseTarget = c
        }
    }
    ;
    b._testMouseOver = function() {
        if (!(this.mouseX == this._mouseOverX && this.mouseY == this._mouseOverY && this.mouseInBounds)) {
            var a = null;
            if (this.mouseInBounds) {
                a = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, 3);
                this._mouseOverX = this.mouseX;
                this._mouseOverY = this.mouseY
            }
            if (this._mouseOverTarget != a) {
                if (this._mouseOverTarget && this._mouseOverTarget.onMouseOut)
                    this._mouseOverTarget.onMouseOut(new MouseEvent("onMouseOver",this.mouseX,this.mouseY));
                if (a && a.onMouseOver)
                    a.onMouseOver(new MouseEvent("onMouseOut",this.mouseX,this.mouseY));
                this._mouseOverTarget = a
            }
        }
    }
    ;
    b._handleDoubleClick = function(a) {
        var b;
        if (this.onDoubleClick) {
            b = new MouseEvent("onDoubleClick",this.mouseX,this.mouseY);
            b.nativeEvent = a;
            this.onDoubleClick(b)
        }
        var c = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, this._mouseOverIntervalID ? 3 : 1);
        if (c)
            if (c.onDoubleClick instanceof Function) {
                b = new MouseEvent("onPress",this.mouseX,this.mouseY);
                b.nativeEvent = a;
                c.onDoubleClick(b)
            }
    }
    ;
    a.Stage = Stage
}
)(window);
(function(a) {
    Bitmap = function(a) {
        this.initialize(a)
    }
    ;
    var b = Bitmap.prototype = new DisplayObject;
    b.image = null;
    b.snapToPixel = true;
    b.DisplayObject_initialize = b.initialize;
    b.initialize = function(a) {
        this.DisplayObject_initialize();
        this.image = a
    }
    ;
    b.isVisible = function() {
        return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.image && (this.image.complete || this.image.getContext)
    }
    ;
    b.DisplayObject_draw = b.draw;
    b.draw = function(a, b) {
        if (this.DisplayObject_draw(a, b))
            return true;
        a.drawImage(this.image, 0, 0);
        return true
    }
    ;
    b.clone = function() {
        var a = new Bitmap(this.image);
        this.cloneProps(a);
        return a
    }
    ;
    b.toString = function() {
        return "[Bitmap (name=" + this.name + ")]"
    }
    ;
    b._calculateBounds = function() {
        return this.image && (this.image.complete || this.image.getContext) ? new Rectangle(0,0,this.image.width,this.image.height) : new Rectangle(0,0,0,0)
    }
    ;
    a.Bitmap = Bitmap
}
)(window);
(function(a) {
    BitmapSequence = function(a) {
        this.initialize(a)
    }
    ;
    var b = BitmapSequence.prototype = new DisplayObject;
    b.callback = null;
    b.currentFrame = -1;
    b.currentSequence = null;
    b.currentEndFrame = null;
    b.currentStartFrame = null;
    b.nextSequence = null;
    b.paused = false;
    b.spriteSheet = null;
    b.snapToPixel = true;
    b.DisplayObject_initialize = b.initialize;
    b.initialize = function(a) {
        this.DisplayObject_initialize();
        this.spriteSheet = a
    }
    ;
    b.isVisible = function() {
        var a = this.spriteSheet ? this.spriteSheet.image : null;
        return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && a && this.currentFrame >= 0 && (a.complete || a.getContext)
    }
    ;
    b.DisplayObject_draw = b.draw;
    b.draw = function(a, b) {
        if (this.DisplayObject_draw(a, b))
            return true;
        var c = this.spriteSheet.image
          , d = this.spriteSheet.frameWidth
          , e = this.spriteSheet.frameHeight
          , f = c.width / d | 0
          , g = c.height / e | 0;
        if (this.currentEndFrame != null) {
            if (this.currentFrame > this.currentEndFrame) {
                if (this.nextSequence)
                    this._goto(this.nextSequence);
                else {
                    this.paused = true;
                    this.currentFrame = this.currentEndFrame
                }
                this.callback && this.callback(this)
            }
        } else {
            g = this.spriteSheet.totalFrames || f * g;
            if (this.currentFrame >= g) {
                if (this.spriteSheet.loop)
                    this.currentFrame = 0;
                else {
                    this.currentFrame = g - 1;
                    this.paused = true
                }
                this.callback && this.callback(this)
            }
        }
        this.currentFrame >= 0 && a.drawImage(c, d * (this.currentFrame % f), e * (this.currentFrame / f | 0), d, e, 0, 0, d, e);
        return true
    }
    ;
    b.tick = function() {
        if (this.currentFrame == -1 && this.spriteSheet.frameData)
            this.paused = true;
        this.paused || this.currentFrame++
    }
    ;
    b.gotoAndPlay = function(a) {
        this.paused = false;
        this._goto(a)
    }
    ;
    b.gotoAndStop = function(a) {
        this.paused = true;
        this._goto(a)
    }
    ;
    b.clone = function() {
        var a = new BitmapSequence(this.spriteSheet);
        this.cloneProps(a);
        return a
    }
    ;
    b.toString = function() {
        return "[BitmapSequence (name=" + this.name + ")]"
    }
    ;
    b.DisplayObject_cloneProps = b.cloneProps;
    b.cloneProps = function(a) {
        this.DisplayObject_cloneProps(a);
        a.callback = this.callback;
        a.currentFrame = this.currentFrame;
        a.currentStartFrame = this.currentStartFrame;
        a.currentEndFrame = this.currentEndFrame;
        a.currentSequence = this.currentSequence;
        a.nextSequence = this.nextSequence;
        a.paused = this.paused;
        a.frameData = this.frameData
    }
    ;
    b._goto = function(a) {
        if (isNaN(a))
            if (a == this.currentSequence)
                this.currentFrame = this.currentStartFrame;
            else {
                var b = this.spriteSheet.frameData[a];
                if (b instanceof Array) {
                    this.currentFrame = this.currentStartFrame = b[0];
                    this.currentSequence = a;
                    this.currentEndFrame = b[1];
                    if (this.currentEndFrame == null)
                        this.currentEndFrame = this.currentStartFrame;
                    if (this.currentEndFrame == null)
                        this.currentEndFrame = this.currentFrame;
                    this.nextSequence = b[2];
                    if (this.nextSequence == null)
                        this.nextSequence = this.currentSequence;
                    else if (this.nextSequence == false)
                        this.nextSequence = null
                } else {
                    this.currentSequence = this.nextSequence = null;
                    this.currentEndFrame = this.currentFrame = this.currentStartFrame = b
                }
            }
        else {
            this.currentSequence = this.nextSequence = this.currentEndFrame = null;
            this.currentStartFrame = 0;
            this.currentFrame = a
        }
    }
    ;
    b._calculateBounds = function() {
        return this.spriteSheet ? new Rectangle(0,0,this.spriteSheet.frameWidth,this.spriteSheet.frameHeight) : new Rectangle(0,0,0,0)
    }
    ;
    a.BitmapSequence = BitmapSequence
}
)(window);
(function(a) {
    Shape = function(a) {
        this.initialize(a)
    }
    ;
    var b = Shape.prototype = new DisplayObject;
    b.graphics = null;
    b.DisplayObject_initialize = b.initialize;
    b.initialize = function(a) {
        this.DisplayObject_initialize();
        this.graphics = a ? a : new Graphics
    }
    ;
    b.isVisible = function() {
        return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.graphics
    }
    ;
    b.DisplayObject_draw = b.draw;
    b.draw = function(a, b) {
        if (this.DisplayObject_draw(a, b))
            return true;
        this.graphics.draw(a);
        return true
    }
    ;
    b.clone = function(a) {
        a = new Shape(a && this.graphics ? this.graphics.clone() : this.graphics);
        this.cloneProps(a);
        return a
    }
    ;
    b.toString = function() {
        return "[Shape (name=" + this.name + ")]"
    }
    ;
    b._calculateBounds = function() {
        return this.graphics ? this.graphics.getBounds() : new Rectangle(0,0,0,0)
    }
    ;
    a.Shape = Shape
}
)(window);
(function(a) {
    Text = function(a, b, c) {
        this.initialize(a, b, c)
    }
    ;
    var b = Text.prototype = new DisplayObject;
    Text._workingContext = document.createElement("canvas").getContext("2d");
    b.text = "";
    b.font = null;
    b.color = null;
    b.textAlign = null;
    b.textBaseline = null;
    b.maxWidth = null;
    b.outline = false;
    b.lineHeight = null;
    b.lineWidth = null;
    b.DisplayObject_initialize = b.initialize;
    b.initialize = function(a, b, c) {
        this.DisplayObject_initialize();
        this.text = a;
        this.font = b;
        this.color = c ? c : "#000"
    }
    ;
    b.isVisible = function() {
        return Boolean(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.text != null && this.text != "")
    }
    ;
    b.DisplayObject_draw = b.draw;
    b.draw = function(a, b) {
        if (this.DisplayObject_draw(a, b))
            return true;
        if (this.outline)
            a.strokeStyle = this.color;
        else
            a.fillStyle = this.color;
        a.font = this.font;
        a.textAlign = this.textAlign ? this.textAlign : "start";
        a.textBaseline = this.textBaseline ? this.textBaseline : "alphabetic";
        for (var c = String(this.text).split(/(?:\r\n|\r|\n)/), d = this.lineHeight == null ? this.getMeasuredLineHeight() : this.lineHeight, e = 0, f = 0, g = c.length; f < g; f++) {
            var h = a.measureText(c[f]).width;
            if (this.lineWidth == null || h < this.lineWidth)
                this._drawTextLine(a, c[f], e);
            else {
                h = c[f].split(/(\s)/);
                for (var i = h[0], j = 1, k = h.length; j < k; j += 2)
                    if (a.measureText(i + h[j] + h[j + 1]).width > this.lineWidth) {
                        this._drawTextLine(a, i, e);
                        e += d;
                        i = h[j + 1]
                    } else
                        i += h[j] + h[j + 1];
                this._drawTextLine(a, i, e)
            }
            e += d
        }
        return true
    }
    ;
    b.getMeasuredWidth = function() {
        return this._getWorkingContext().measureText(this.text).width
    }
    ;
    b.getMeasuredLineHeight = function() {
        return this._getWorkingContext().measureText("M").width * 1.2
    }
    ;
    b.clone = function() {
        var a = new Text(this.text,this.font,this.color);
        this.cloneProps(a);
        return a
    }
    ;
    b.toString = function() {
        return "[Text (text=" + (this.text.length > 20 ? this.text.substr(0, 17) + "..." : this.text) + ")]"
    }
    ;
    b.DisplayObject_cloneProps = b.cloneProps;
    b.cloneProps = function(a) {
        this.DisplayObject_cloneProps(a);
        a.textAlign = this.textAlign;
        a.textBaseline = this.textBaseline;
        a.maxWidth = this.maxWidth;
        a.outline = this.outline;
        a.lineHeight = this.lineHeight;
        a.lineWidth = this.lineWidth
    }
    ;
    b._getWorkingContext = function() {
        var a = Text._workingContext;
        a.font = this.font;
        a.textAlign = this.textAlign ? this.textAlign : "start";
        a.textBaseline = this.textBaseline ? this.textBaseline : "alphabetic";
        return a
    }
    ;
    b._drawTextLine = function(a, b, c) {
        this.outline ? a.strokeText(b, 0, c, this.maxWidth) : a.fillText(b, 0, c, this.maxWidth)
    }
    ;
    b._calculateBounds = function() {}
    ;
    a.Text = Text
}
)(window);
(function(a) {
    SpriteSheetUtils = function() {
        throw "SpriteSheetUtils cannot be instantiated"
    }
    ;
    SpriteSheetUtils._workingCanvas = document.createElement("canvas");
    SpriteSheetUtils._workingContext = SpriteSheetUtils._workingCanvas.getContext("2d");
    SpriteSheetUtils.flip = function(a, b) {
        var c = a.image, d = a.frameData, e = a.frameWidth, f = a.frameHeight, g = c.width / e | 0, h = c.height / f | 0, i = g * h, j = {}, k, l;
        for (l in d) {
            k = d[l];
            if (k instanceof Array)
                k = k.slice(0);
            j[l] = k
        }
        var m = []
          , n = 0
          , o = 0;
        for (l in b) {
            k = b[l];
            k = d[k[0]];
            if (k != null) {
                if (k instanceof Array) {
                    var p = k[0]
                      , q = k[1];
                    if (q == null)
                        q = p
                } else
                    p = q = k;
                m[o] = l;
                m[o + 1] = p;
                m[o + 2] = q;
                n += q - p + 1;
                o += 4
            }
        }
        d = SpriteSheetUtils._workingCanvas;
        d.width = c.width;
        d.height = Math.ceil(h + n / g) * f;
        n = SpriteSheetUtils._workingContext;
        n.drawImage(c, 0, 0, g * e, h * f, 0, 0, g * e, h * f);
        h = i - 1;
        for (o = 0; o < m.length; o += 4) {
            l = m[o];
            p = m[o + 1];
            q = m[o + 2];
            k = b[l];
            i = k[1] ? -1 : 1;
            for (var r = k[2] ? -1 : 1, s = i == -1 ? e : 0, t = r == -1 ? f : 0, u = p; u <= q; u++) {
                h++;
                n.save();
                n.translate(h % g * e + s, (h / g | 0) * f + t);
                n.scale(i, r);
                n.drawImage(c, u % g * e, (u / g | 0) * f, e, f, 0, 0, e, f);
                n.restore()
            }
            j[l] = [h - (q - p), h, k[3]]
        }
        c = new Image;
        c.src = d.toDataURL("image/png");
        return new SpriteSheet(c.width > 0 ? c : d,e,f,j)
    }
    ;
    SpriteSheetUtils.frameDataToString = function(a) {
        var b = "", c = 0, d = 0, e = 0, f, g;
        for (g in a) {
            e++;
            f = a[g];
            if (f instanceof Array) {
                var h = f[0]
                  , i = f[1];
                if (i == null)
                    i = h;
                f = f[2];
                if (f == null)
                    f = g
            } else {
                h = i = f;
                f = g
            }
            b += "\n\t" + g + ", start=" + h + ", end=" + i + ", next=" + f;
            if (f == false)
                b += " (stop)";
            else if (f == g)
                b += " (loop)";
            if (i > c)
                c = i;
            if (h < d)
                d = h
        }
        return e + " sequences, min=" + d + ", max=" + c + b
    }
    ;
    SpriteSheetUtils.extractFrame = function(a, b) {
        var c = a.image
          , d = a.frameWidth
          , e = a.frameHeight
          , f = c.width / d | 0;
        if (isNaN(b)) {
            var g = a.frameData[b];
            b = g instanceof Array ? g[0] : g
        }
        g = SpriteSheetUtils._workingCanvas;
        g.width = d;
        g.height = e;
        SpriteSheetUtils._workingContext.drawImage(c, b % f * d, (b / f | 0) * e, d, e, 0, 0, d, e);
        c = new Image;
        c.src = g.toDataURL("image/png");
        return c
    }
    ;
    a.SpriteSheetUtils = SpriteSheetUtils
}
)(window);
(function(a) {
    Tween = function(a, b) {
        this.initialize(a, b)
    }
    ;
    var b = Tween.prototype;
    Tween._tweens = [];
    Tween.cssSuffixMap = {
        top: "px",
        left: "px"
    };
    Tween.get = function(a, b, c) {
        if (c && a.tweenjs_tweenCount) {
            var d = Tween._tweens;
            var e = d.length;
            for (var f = e - 1; f >= 0; f--) {
                if (d[f]._target == a) {
                    d.splice(f, 1)
                }
            }
            a.tweenjs_tweenCount = 0
        }
        var g = new Tween(a,b);
        Tween._register(g, true);
        return g
    }
    ;
    if (a.Ticker) {
        Ticker.addListener(Tween)
    }
    Tween.tick = function(a) {
        var b = Tween._tweens;
        var c = b.length;
        for (var d = c - 1; d >= 0; d--) {
            b[d].tick(a)
        }
    }
    ;
    Tween._register = function(a, b) {
        if (b) {
            if (a._target.tweenjs_tweenCount == null) {
                a._target.tweenjs_tweenCount = 1
            } else {
                a._target.tweenjs_tweenCount++
            }
            Tween._tweens.push(a)
        } else {
            a._target.tweenjs_tweenCount--;
            var c = Tween._tweens.indexOf(a);
            if (c != -1) {
                Tween._tweens.splice(c, 1)
            }
        }
    }
    ;
    b._paused = false;
    b._curQueueProps = null;
    b._initQueueProps = null;
    b._steps = null;
    b._actions = null;
    b._prevPosition = 0;
    b._prevPos = -1;
    b._prevIndex = -1;
    b._target = null;
    b._duration = 0;
    b._css = false;
    b.initialize = function(a, b) {
        this._target = a;
        this._css = b;
        this._curQueueProps = {};
        this._initQueueProps = {};
        this._steps = [];
        this._actions = [];
        this._catalog = []
    }
    ;
    b.wait = function(a) {
        if (a == null || a <= 0) {
            return this
        }
        var b = this._cloneProps(this._curQueueProps);
        return this._addStep({
            d: a,
            p0: b,
            e: this._linearEase,
            p1: b
        })
    }
    ;
    b.to = function(a, b, c) {
        if (isNaN(b) || b < 0) {
            b = 0
        }
        return this._addStep({
            d: b ? b : 0,
            p0: this._cloneProps(this._curQueueProps),
            e: c,
            p1: this._cloneProps(this._appendQueueProps(a))
        })
    }
    ;
    b.from = function(a, b, c) {
        if (isNaN(b) || b < 0) {
            b = 0
        }
        return this._addStep({
            d: b ? b : 0,
            p1: this._cloneProps(this._curQueueProps),
            p0: this._cloneProps(this._appendQueueProps(a)),
            e: c
        })
    }
    ;
    b.call = function(a, b, c) {
        return this._addAction({
            f: a,
            p: b ? b : [this],
            o: c ? c : this._target
        })
    }
    ;
    b.set = function(a, b) {
        return this._addAction({
            f: this._set,
            o: this,
            p: [a, b ? b : this._target]
        })
    }
    ;
    b.play = function(a) {
        return this.call(a.setPaused, [false], a)
    }
    ;
    b.pause = function(a) {
        if (!a) {
            a = this
        }
        return this.call(a.setPaused, [true], a)
    }
    ;
    b.loop = function() {
        this._loop = true;
        return this
    }
    ;
    b.setPosition = function(a, b) {
        if (a == this._prevPosition) {
            return
        }
        if (b == null) {
            b = true
        }
        var c = a;
        var d = false;
        if (c > this._duration) {
            if (this._loop) {
                c = c % this._duration;
                d = c < this._prevPos
            } else {
                c = this._duration
            }
        }
        if (c != this._prevPos) {
            if (c == this._duration && !this._loop) {
                this._updateTargetProps(null, 1)
            } else if (this._steps.length > 0) {
                for (var e = 0, f = this._steps.length; e < f; e++) {
                    if (this._steps[e].t > c) {
                        break
                    }
                }
                var g = this._steps[e - 1];
                this._updateTargetProps(g, (c - g.t) / g.d)
            }
        }
        if (b && this._actions.length > 0) {
            if (d) {
                this._runActions(this._prevPos, this._duration);
                this._runActions(0, c)
            } else {
                this._runActions(this._prevPos, c)
            }
        }
        this._prevPos = c;
        this._prevPosition = a;
        if (c == this._duration && !this._loop) {
            this.setPaused(true)
        }
    }
    ;
    b.tick = function(a) {
        if (this._paused) {
            return
        }
        this.setPosition(this._prevPosition + a)
    }
    ;
    b.setPaused = function(a) {
        this._paused = !!a;
        Tween._register(this, !a)
    }
    ;
    b.w = b.wait;
    b.f = b.from;
    b.t = b.to;
    b.p = b.pause;
    b.pl = b.play;
    b.c = b.call;
    b.s = b.set;
    b.l = b.loop;
    b.toString = function() {
        return "[Tween]"
    }
    ;
    b.clone = function() {
        return new Tween
    }
    ;
    b._updateTargetProps = function(a, b) {
        if (this._css) {
            var c = this.cssSuffixMap || Tween.cssSuffixMap
        }
        var d, e, f, g;
        if (!a && b == 1) {
            d = e = this._curQueueProps
        } else {
            if (a.e) {
                b = a.e(b, 0, 1, 1)
            }
            d = a.p0;
            e = a.p1
        }
        for (n in this._initQueueProps) {
            if ((f = d[n]) == (g = e[n]) || b == 0 || b == 1) {
                if (b == 1) {
                    f = g
                }
                if (f == null) {
                    f = this._initQueueProps[n]
                }
            } else {
                if (f == null) {
                    d[n] = f = this._initQueueProps[n]
                }
                f += (g - f) * b
            }
            this._target[n] = c && c[n] ? f + c[n] : f
        }
    }
    ;
    b._runActions = function(a, b, c) {
        var d = a;
        var e = b;
        var f = -1;
        var g = this._actions.length;
        var h = 1;
        if (a > b) {
            d = b;
            e = a;
            f = g;
            g = h = -1
        }
        while ((f += h) != g) {
            var i = this._actions[f];
            var j = i.t;
            if (j > d && j <= e || c && j == a) {
                i.f.apply(i.o, i.p)
            }
        }
    }
    ;
    b._appendQueueProps = function(a) {
        if (this._css) {
            var b = this.cssSuffixMap || Tween.cssSuffixMap
        }
        var c, d;
        for (var e in a) {
            if (this._initQueueProps[e] == null) {
                if (b && (c = b[e])) {
                    var f = this._target[e];
                    var g = f.length - c.length;
                    if ((d = f.substr(g)) != c) {
                        throw "TweenJS Error: Suffixes do not match. (" + c + ":" + d + ")"
                    } else {
                        this._initQueueProps[e] = parseInt(f.substr(0, g))
                    }
                } else {
                    this._initQueueProps[e] = this._target[e]
                }
            }
            this._curQueueProps[e] = a[e]
        }
        return this._curQueueProps
    }
    ;
    b._cloneProps = function(a) {
        var b = {};
        for (var c in a) {
            b[c] = a[c]
        }
        return b
    }
    ;
    b._addStep = function(a) {
        if (a.d > 0) {
            this._steps.push(a);
            a.t = this._duration;
            this._duration += a.d
        }
        return this
    }
    ;
    b._addAction = function(a) {
        a.t = this._duration;
        this._actions.push(a);
        return this
    }
    ;
    b._set = function(a, b) {
        for (var c in a) {
            b[c] = a[c]
        }
    }
    ;
    a.Tween = Tween
}
)(window);
(function(a) {
    function c(a, b) {
        this.instances = [];
        this.name = a;
        this.src = b;
        this.loaded = this.canPlay = false;
        this.length = 0
    }
    function b() {
        throw "SoundJS cannot be instantiated"
    }
    b.AUDIO_TIMEOUT = 8e3;
    b.INTERRUPT_ANY = 1;
    b.INTERRUPT_EARLY = 2;
    b.INTERRUPT_LATE = 3;
    b.INTERRUPT_NONE = 4;
    b.onProgress = null;
    b.onSoundTimeout = null;
    b.onSoundLoadError = null;
    b.onSoundLoadComplete = null;
    b.onLoadQueueComplete = null;
    b.onSoundComplete = null;
    b.soundHash = [];
    b.loadQueue = [];
    b.itemsToLoad = 0;
    b.instanceCount = 0;
    b.INST_MAX = 35;
    b.FT = .001;
    b.AUDIO_ERROR = "error";
    b.AUDIO_PROGRESS = "progress";
    b.AUDIO_COMPLETE = "canplaythrough";
    b.AUDIO_ENDED = "ended";
    b.AUDIO_STALLED = "stalled";
    b._master = 1;
    b._currentLoad = 0;
    b.add = function(a, c, d) {
        b.loadQueue.push({
            name: a,
            src: c,
            instances: d
        });
        b.loadQueue.length == 1 ? (b.itemsToLoad = 1,
        b.loadNext()) : b.itemsToLoad++
    }
    ;
    b.addBatch = function(a) {
        for (var c = a.length; a.length; )
            b.loadQueue.push(a.shift());
        b.loadQueue.length == c ? (b.loadNext(),
        b.itemsToLoad = c) : b.itemsToLoad++
    }
    ;
    b.play = function(a, c, d, e, f) {
        if (a == null || b.soundHash[a] == null || b.soundHash[a].length == 0 || c != b.INTERRUPT_ANY && c != b.INTERRUPT_EARLY && c != b.INTERRUPT_LATE && c != b.INTERRUPT_NONE && c != null)
            return NaN;
        if (c == null)
            c = b.INTERRUPT_NONE;
        e == null && (e = false);
        f || (f = 0);
        d == null || d > 1 ? d = 1 : d < 0 && (d = 0);
        if (f > 0)
            setTimeout(function() {
                b.beginPlaying(a, c, d, e)
            }, f);
        else
            return b.beginPlaying(a, c, d, e);
        return -1
    }
    ;
    b.getMasterVolume = function() {
        return b._master
    }
    ;
    b.setMasterVolume = function(a) {
        if (Number(a) != null) {
            a < 0 ? a = 0 : a > 1 && (a = 1);
            var c, d, e;
            c = b._master;
            b._master = a;
            if (b._master != c)
                for (e in b.soundHash) {
                    d = b.soundHash[e];
                    c = d.length;
                    for (a = 0; a < c; a++)
                        d[a].volume = d[a].storedVolume * b._master
                }
        }
    }
    ;
    b.remove = function(a, c) {
        var d, e, f;
        if (a == null)
            for (d in b.soundHash) {
                f = b.soundHash[d];
                e = f.length;
                do
                    b.stop(d, e - 1),
                    f[e - 1].currentSrc = "",
                    document.body.removeChild(f[e - 1]),
                    f.pop(),
                    e = f.length,
                    b.instanceCount--;
                while (e)
            }
        else {
            f = b.soundHash[a];
            if (f == null)
                return false;
            e = f.length;
            if (c == null) {
                do
                    b.stop(a, e - 1),
                    f[e - 1].currentSrc = "",
                    document.body.removeChild(f[e - 1]),
                    f.pop(),
                    e = f.length,
                    b.instanceCount--;
                while (e)
            } else {
                if (c <= 0 || e <= 0)
                    return false;
                e--;
                for (d = 0; d <= e && d < c; d++)
                    b.stop(a, e - d),
                    f[e - d].currentSrc = "",
                    document.body.removeChild(f[e - d]),
                    f.pop(),
                    b.instanceCount--
            }
        }
        return true
    }
    ;
    b.setVolume = function(a, c, d) {
        var e, f;
        if (a == null)
            return false;
        a *= b._master;
        if (c == null)
            for (f in b.soundHash) {
                e = b.soundHash[f];
                c = e.length;
                for (d = 0; d < c; d++)
                    e[d].storedVolume = a,
                    e[d].volume = a
            }
        else {
            e = b.soundHash[c];
            if (e == null)
                return false;
            c = e.length;
            if (d == null)
                for (d = 0; d < c; d++)
                    e[d].storedVolume = a,
                    e[d].volume = a;
            else {
                if (c <= d)
                    return false;
                e[d].storedVolume = a;
                e[d].volume = a
            }
        }
        return true
    }
    ;
    b.getVolume = function(a, c) {
        var d = b.soundHash[a];
        return d == null || d.length == 0 ? -1 : c == null ? d[1].storedVolume : d.length < c ? -1 : d[c].storedVolume
    }
    ;
    b.setMute = function(a, c, d) {
        var e, f;
        if (a == null)
            return false;
        if (c == null)
            for (f in b.soundHash) {
                e = b.soundHash[f];
                c = e.length;
                for (d = 0; d < c; d++)
                    e[d].muted = a
            }
        else {
            e = b.soundHash[c];
            if (e == null)
                return false;
            c = e.length;
            if (d == null)
                for (d = 0; d < c; d++)
                    e[d].muted = a;
            else {
                if (c <= d)
                    return false;
                e[d].muted = a
            }
        }
        return true
    }
    ;
    b.pause = function(a, c) {
        var d, e, f, g;
        if (a == null)
            for (g in b.soundHash) {
                f = b.soundHash[g];
                e = f.length;
                for (d = 0; d < e; d++)
                    f[d].pause()
            }
        else {
            f = b.soundHash[a];
            if (f == null)
                return false;
            e = f.length;
            if (c == null)
                for (d = 0; d < e; d++)
                    f[d].pause();
            else {
                if (e <= c)
                    return false;
                f[c].pause()
            }
        }
        return true
    }
    ;
    b.resume = function(a, c) {
        var d, e, f, g;
        if (a == null)
            for (g in b.soundHash) {
                e = b.soundHash[g].length;
                for (d = 0; d < e; d++)
                    f = b.soundHash[g][d],
                    (f.loop || f.currentTime != f.duration && f.currentTime != 0) && f.play()
            }
        else {
            if (b.soundHash[a] == null)
                return false;
            e = b.soundHash[a].length;
            if (c == null)
                for (d = 0; d < e; d++)
                    f = b.soundHash[a][d],
                    (f.loop || f.currentTime != f.duration && f.currentTime != 0) && f.play();
            else {
                if (e <= c)
                    return false;
                f = b.soundHash[a][c];
                (f.loop || f.currentTime != f.duration && f.currentTime != 0) && f.play()
            }
        }
        return true
    }
    ;
    b.stop = function(a, c) {
        var d, e, f, g;
        if (a == null)
            for (g in b.soundHash) {
                e = b.soundHash[g].length;
                for (d = 0; d < e; d++) {
                    f = b.soundHash[g][d];
                    try {
                        f.currentTime = 0
                    } catch (h) {}
                    f.pause()
                }
            }
        else {
            if (b.soundHash[a] == null)
                return false;
            e = b.soundHash[a].length;
            if (c == null)
                for (d = 0; d < e; d++)
                    f = b.soundHash[a][d],
                    f.currentTime = 0,
                    f.pause();
            else {
                if (e <= c)
                    return false;
                f = b.soundHash[a][c];
                f.currentTime = 0;
                f.pause()
            }
        }
        return true
    }
    ;
    b.isLoaded = function(a) {
        var c = true, d;
        if (a == null)
            for (d in b.soundHash) {
                if (c = c && b.soundHash[d] && b.soundHash[d][0] && b.soundHash[d][0].loaded,
                !c)
                    break
            }
        else
            return b.soundHash[a] && b.soundHash[a][0] && b.soundHash[a][0].loaded;
        return c
    }
    ;
    b.getNumInstances = function(a) {
        return a == null ? instanceCount : b.soundHash[a] ? b.soundHash[a].length : -1
    }
    ;
    b.getMaxInstances = function() {
        return b.INST_MAX
    }
    ;
    b.getCurrentLoadProgress = function() {
        return (b.itemsToLoad - b.loadQueue.length - (1 - b._currentLoad)) / b.itemsToLoad
    }
    ;
    b.getInstance = function(a, c) {
        return a == null || c < 0 || !b.soundHash[a] || !b.soundHash[a][c] ? null : b.soundHash[a][c]
    }
    ;
    b.beginPlaying = function(a, c, d, e) {
        var f, g, h, i = false, j = b.soundHash[a];
        if (!j[0].loaded)
            throw Error("Audio is not loaded. The source(s) are either not found, or the correct audio formats are not provided.");
        for (var k = j.length, a = 0; a < k; a++) {
            h = j[a];
            g == null && c != b.INTERRUPT_ANY && c != b.INTERRUPT_NONE && (g = h,
            f = a);
            if (h.currentTime >= h.duration - b.FT && !h.loop || h.currentTime == 0 && h.paused)
                i = true,
                k = a;
            else if (c == b.INTERRUPT_EARLY && h.currentTime < g.currentTime || c == b.INTERRUPT_LATE && h.currentTime > g.currentTime)
                i = true;
            i && (g = h,
            f = a)
        }
        c == b.INTERRUPT_ANY && !g && (g = j[0],
        f = 0);
        return g ? (g.loop = e,
        g.storedVolume = d,
        g.volume = d * b._master,
        g.currentTime = 0,
        g.paused && g.play(),
        f) : -1
    }
    ;
    b.loadNext = function() {
        if (b.loadQueue.length <= 0) {
            if (b.onLoadQueueComplete)
                b.onLoadQueueComplete()
        } else {
            var a = b.loadQueue.shift()
              , c = a.instances || 1
              , d = a.name
              , a = a.src
              , e = b.soundHash[d];
            if (e == null)
                e = b.soundHash[d] = [];
            else if (e.length)
                a = e[0].src;
            for (var f = e = e.length, c = e + c; f < c; f++) {
                var g = document.createElement("audio");
                if (f == e)
                    g.timeoutId = setTimeout(function() {
                        b.handleAudioTimeout(g)
                    }, b.AUDIO_TIMEOUT),
                    g.addEventListener(b.AUDIO_COMPLETE, b.handleAudioComplete, false),
                    g.addEventListener(b.AUDIO_PROGRESS, b.handleProgress, false),
                    g.addEventListener(b.AUDIO_STALLED, b.handleAudioStall, false),
                    g.addEventListener(b.AUDIO_ERROR, b.handleAudioError, false),
                    g.loaded = false;
                g.addEventListener(b.AUDIO_ENDED, b.handleEnded, false);
                g.setAttribute("id", d + "_" + f);
                g.setAttribute("preload", "auto");
                var h;
                if (a instanceof Array)
                    for (var i = 0, j = a.length; i < j; i++) {
                        var k = g.appendChild(document.createElement("source"));
                        h = b.getType(a[i]);
                        k.setAttribute("type", h);
                        k.setAttribute("src", a[i])
                    }
                else
                    h = b.getType(a),
                    g.setAttribute("type", h),
                    g.setAttribute("src", a);
                g.load();
                document.body.appendChild(g);
                b.soundHash[d].push(g);
                b.instanceCount++
            }
        }
    }
    ;
    b.getType = function(a) {
        switch (a.slice(a.lastIndexOf(".") + 1)) {
        case "mp3":
            return "audio/mpeg";
        case "ogg":
            return "audio/ogg";
        case "wav":
            return "audio/wav";
        default:
            throw "'" + a + "' is not a recognized audio file"
        }
    }
    ;
    b.handleEnded = function() {
        if (b.onSoundEnded) {
            var a = this.id.split("_");
            b.onSoundEnded(this, a[0], a[1])
        }
    }
    ;
    b.handleAudioTimeout = function(a) {
        if (b.onSoundTimeout) {
            var c = a.id.split("_");
            b.onSoundTimeout(a, c[0], c[1])
        }
        b.loadNext()
    }
    ;
    b.handleProgress = function() {
        try {
            this.buffered.end()
        } catch (a) {
            return
        }
        b._currentLoad = this.buffered.end() / this.duration;
        if (b.onProgress)
            b.onProgress(b.getCurrentLoadProgress())
    }
    ;
    b.handleAudioError = function() {
        clearTimeout(this.timeoutId);
        if (b.onSoundLoadError) {
            var a = this.id.split("_");
            b.onSoundLoadError(this, a[0], a[1])
        }
        b.loadNext()
    }
    ;
    b.handleAudioComplete = function() {
        var a = this.id.split("_");
        this.removeEventListener(b.AUDIO_COMPLETE, b.handleAudioComplete, false);
        clearTimeout(this.timeoutId);
        this.loaded = true;
        if (b.onSoundLoadComplete)
            b.onSoundLoadComplete(this, a[0], a[1]);
        b.loadNext()
    }
    ;
    b.handleAudioStall = function(a) {
        setTimeout(function() {
            testAudioStall(a)
        }, 0)
    }
    ;
    b.testAudioStall = function() {
        var a = this.id.split("_");
        if (!b.soundHash[a[0]][a[1]].loaded) {
            if (b.onStall)
                b.onStall(this, a[0], a[1]);
            b.loadNext()
        }
    }
    ;
    a.SoundJS = b;
    var d = c.prototype;
    d.add = function(a) {
        this.instances.push(a);
        this.length = this.instances.length;
        this.instances.length == 1 && a.addEventListener("canplaythrough", function() {
            a.canplaythrough()
        })
    }
    ;
    d.remove = function(a) {
        this.instances.splice(a, 1);
        this.length = this.instances.length
    }
    ;
    d.canplaythrough = function() {
        this.loaded = true
    }
    ;
    a.SoundJSElement = c
}
)(window);
var canvas;
var stage;
var bgImg = new Image;
var bg;
var bg2Img = new Image;
var bg2;
var sImg = new Image;
var ship;
var eImg = new Image;
var bImg = new Image;
var boss;
var lImg = new Image;
var bltImg = new Image;
var winImg = new Image;
var loseImg = new Image;
var win;
var lose;
var lives = new Container;
var bullets = new Container;
var enemies = new Container;
var bossHealth = 20;
var score;
var gfxLoaded = 0;
var centerX = 160;
var centerY = 240;
var tkr = new Object;
var timerSource
