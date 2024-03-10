const vsSource = `
    attribute vec3 a_Position;
    attribute vec3 a_Color;
    attribute vec3 a_Normal;

    uniform mat4 u_Pmatrix;
    uniform mat4 u_Mmatrix;
    uniform mat4 u_Vmatrix;

    uniform vec3 u_LightDirection;
    uniform vec4 u_LightColor;
    uniform vec4 u_AmbientColor;
    uniform vec3 u_ViewPosition;
    uniform float u_LightIntensity;
    uniform float u_Shininess;
    uniform float u_Parallax;

    varying vec3 v_Color;
    varying vec3 v_Normal;
    varying vec3 v_Position;

    void main(void) {
        vec4 transformedNormal = u_Mmatrix * vec4(a_Normal, 0.0);
        v_Normal = normalize(transformedNormal.xyz);

        vec3 viewDir = normalize(u_ViewPosition - a_Position);
        vec3 adjustedPosition = a_Position - viewDir * u_Parallax; // Adjust this factor as needed

        vec4 worldPosition = u_Mmatrix * vec4(adjustedPosition, 1.0);
        v_Position = vec3(worldPosition.xyz);

        float nDotL = max(dot(v_Normal, normalize(u_LightDirection)), 0.0);
        vec3 diffuse = u_LightColor.rgb * a_Color * nDotL * u_LightIntensity;

        vec3 ambient = u_AmbientColor.rgb * a_Color;

        vec3 reflectDir = reflect(-normalize(u_LightDirection), v_Normal);  
        vec3 specular = u_LightColor.rgb * pow(max(dot(viewDir, reflectDir), 0.0), u_Shininess) * u_LightIntensity;

        v_Color = ambient + diffuse + specular;
        gl_Position = u_Pmatrix * u_Vmatrix * worldPosition;
    }`;
