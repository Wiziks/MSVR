function calculateVertices() {
    const vertices = [];
    const originSinusoid = [];
    const uv = [];

    for (let x = 0; x <= maxX; x += deltaX) {
        const y = b * Math.sin(c * x);
        originSinusoid.push(x, y, 0);
    }

    for (let index = 0; index < originSinusoid.length; index += 3) {
        for (let angle = 0; angle < 360; angle += deltaAngle) {
            const x = originSinusoid[index];
            const y = originSinusoid[index + 1];
            const z = originSinusoid[index + 2];
            const rotPoint = rotatePointAroundY(x, y, z, angle);
            vertices.push(rotPoint[0], rotPoint[1], rotPoint[2]);
            vertices.push(figureColor[0], figureColor[1], figureColor[2]);

            const u = (originSinusoid[index] / maxX) / (scaleUV);
            const v = angle / 360 / scaleUV;

            if (Math.round(u * 100) / 100 == centerUV[0] && Math.round(v * 100) / 100 == centerUV[1]) {
                boxPosition = [rotPoint[0], rotPoint[1], rotPoint[2]]
            }

            uv.push(Math.min(Math.max(u, 0), 1), Math.min(Math.max(v, 0), 1));
        }
    }

    const [faces, averagedNormals] = generateFaces(vertices, vertices.length / 3.5, 360 / deltaAngle);

    var result = [];
    var i = 0;
    var j = 0;

    while (i < vertices.length || j < uv.length) {
        for (var k = 0; k < 6 && i < vertices.length; k++) {
            result.push(vertices[i]);
            i++;
        }

        for (var l = 0; l < 2 && j < uv.length; l++) {
            result.push(uv[j]);
            j++;
        }
    }

    return [result, faces, averagedNormals];
}

function generateFaces(vertices, numGroups, segmenst) {
    const faces = [];
    const normals = new Array(vertices.length / 6).fill(null).map(() => []);

    let start = 0;
    let end = 1;

    for (let i = 0; i < segmenst; i++) {
        start++;
        end++;
        faces.push(0, start, end);
        addFaceNormal(vertices, normals, 0, start, end);
    }

    start = 1;

    faces.push(0, start, end);
    addFaceNormal(vertices, normals, 0, start, end);

    for (let i = 0; i < numGroups - segmenst; i += 2) {
        faces.push(start, start + 1, end + 1);
        addFaceNormal(vertices, normals, start, start + 1, end + 1);

        faces.push(start, end, end + 1);
        addFaceNormal(vertices, normals, start, end, end + 1);

        start++;
        end++;
    }

    const averagedNormals = normals.map(averageNormals);

    return [faces, averagedNormals];
}

function addFaceNormal(vertices, normals, v1, v2, v3) {
    const normal = calculateNormal(
        [vertices[v1 * 6], vertices[v1 * 6 + 1], vertices[v1 * 6 + 2]],
        [vertices[v2 * 6], vertices[v2 * 6 + 1], vertices[v2 * 6 + 2]],
        [vertices[v3 * 6], vertices[v3 * 6 + 1], vertices[v3 * 6 + 2]]
    );

    normals[v1].push(normal);
    normals[v2].push(normal);
    normals[v3].push(normal);
}

function calculateNormal(v1, v2, v3) {
    let edge1 = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
    let edge2 = [v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]];

    let nx = edge1[1] * edge2[2] - edge1[2] * edge2[1];
    let ny = edge1[2] * edge2[0] - edge1[0] * edge2[2];
    let nz = edge1[0] * edge2[1] - edge1[1] * edge2[0];

    let length = Math.sqrt(nx * nx + ny * ny + nz * nz);
    return [nx / length, ny / length, nz / length];
}

function averageNormals(normals) {
    let sum = normals.reduce((acc, n) => [acc[0] + n[0], acc[1] + n[1], acc[2] + n[2]], [0, 0, 0]);

    let count = normals.length;
    return [sum[0] / count, sum[1] / count, sum[2] / count];
}

function rotatePointAroundY(x, y, z, angle) {
    const angleRadians = angle * Math.PI / 180.0;

    const x1 = x * Math.cos(angleRadians) - z * Math.sin(angleRadians);
    const z1 = x * Math.sin(angleRadians) + z * Math.cos(angleRadians);

    return [x1, y, z1];
}