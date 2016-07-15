
/*
    Factory
*/
se.factory = {};

se.factory.rect = function (options){
    var opt = options || {};
    var name = opt.name || '';
    var x = opt.x || 0;
    var y = opt.y || 0;
    var w = opt.w || 10;
    var h = opt.h || 10;
    var img = opt.image_src;
    var fillColor = opt.fillColor || '#6B4226';
    var rigidopts = opt.rigidopts || {};

    var hasRigidbody = opt.hasRigidbody || true;

    var vertices = [
        new se.Vector(0, 0),
        new se.Vector(w, 0),
        new se.Vector(w, h),
        new se.Vector(0, h),
    ];

    var obj = new se.GameObject(name, x, y, {vertices: vertices});

    if(hasRigidbody)
        obj.setRigidBody( new se.RigidBody(rigidopts) );

    // Render
    if(img)
        obj.setRenderer( new se.ImageRenderer(img, w, h) );
    else
        obj.setRenderer( new se.RectRenderer(fillColor, w, h) );
    return obj;
};

se.factory.circle = function (options){
    var opt = options || {};
    var name = opt.name || '';
    var x = opt.x || 0;
    var y = opt.y || 0;
    var radius = opt.radius || 10;
    var rigidopts = opt.rigidopts || {};
    var maxSides = opt.maxSides || 25;

    var hasRigidbody = opt.hasRigidbody || true;

    var fillColor = opt.fillColor;
    var strokeColor = opt.strokeColor;
    var lineWidth = opt.lineWidth;

    var vertices = se.factory.createCircleVertices(radius, maxSides);

    var obj = new se.GameObject(name, x, y, {vertices: vertices});

    if(hasRigidbody)
        obj.setRigidBody( new se.RigidBody(rigidopts) );
    obj.setRenderer( new se.CircleRenderer(radius, fillColor, strokeColor, lineWidth) );
    return obj;
};

se.factory.createCircleVertices = function (radius, maxSides){
    // approximate circles with polygons until true circles implemented in SAT
    maxSides = maxSides || 25;
    var sides = Math.ceil(Math.max(10, Math.min(maxSides, radius)));

    // optimisation: always use even number of sides (half the number of unique axes)
    if (sides % 2 === 1)
        sides += 1;

    var theta = 2 * Math.PI / sides,
        path = '',
        offset = theta * 0.5;

    for (var i = 0; i < sides; i += 1) {
        var angle = offset + (i * theta),
            xx = Math.cos(angle) * radius,
            yy = Math.sin(angle) * radius;

        path += 'L ' + xx.toFixed(3) + ' ' + yy.toFixed(3) + ' ';
    }
    return Matter.Vertices.fromPath(path);

};
