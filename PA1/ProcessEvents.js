function processEvents(setup) {
    document.addEventListener('keydown', (event) => {
        const keyName = event.key;

        switch (keyName) {
            case '1':
                currentTexture = 0;
                setup();
                break;
            case '2':
                currentTexture = 1;
                setup();
                break;
            case '3':
                currentTexture = 2;
                setup();
                break;
            default:
                break;
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            viewPosition = [0, 0, viewPosition[2] + 1]
        } else if (e.key === 'ArrowDown') {
            viewPosition = [0, 0, viewPosition[2] - 1]
        }
        setup();
    })

    canvas.addEventListener('mousedown', (e) => {
        isSwiping = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    canvas.addEventListener('mouseup', () => {
        isSwiping = false;
        swipeDelta = [0, 0]
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isSwiping) return;

        const currentX = e.clientX;
        const currentY = e.clientY;

        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
        startX = currentX
        startY = currentY

        swipeDelta = [deltaX, deltaY]
        setup();
    });

    canvas.addEventListener('wheel', (event) => {
        if (event.deltaY > 0) {
            viewPosition = [0, 0, viewPosition[2] - 1]
        } else if (event.deltaY < 0) {
            viewPosition = [0, 0, viewPosition[2] + 1]
        }
        setup();
    });

    const sliderPrefix = 'slider';
    const sliderValuePrefix = 'slider-value';

    for (let i = 1; i <= 31; i++) {
        const sliderId = `${sliderPrefix}${i}`;
        const sliderValueId = `${sliderValuePrefix}${i}`;

        const slider = document.getElementById(sliderId);
        const sliderValue = document.getElementById(sliderValueId);

        if (slider == null) {
            console.log("Slider with id " + sliderId + " not found");
        } else {
            slider.addEventListener('input', (e) => {
                const sliderVal = parseFloat(e.target.value).toFixed(1);
                sliderValue.textContent = sliderVal;
                if (i < 4)
                    scale[i - 1] = sliderVal;
                else if (i < 7)
                    figureColor[i - 4] = sliderVal;
                else if (i == 7)
                    b = sliderVal;
                else if (i == 8)
                    c = sliderVal;
                else if (i == 9)
                    maxX = sliderVal;
                else if (i == 10)
                    deltaX = Number(sliderVal);
                else if (i == 11)
                    deltaAngle = Number(sliderVal);
                else if (i == 12)
                    sensivity = sliderVal / 10000;
                else if (i < 16)
                    lightDirection[i - 13] = sliderVal;
                else if (i < 19)
                    lightColor[i - 16] = sliderVal;
                else if (i < 22)
                    ambientColor[i - 19] = sliderVal;
                else if (i == 22)
                    lightIntensity = Number(sliderVal);
                else if (i == 23)
                    shininess = Number(sliderVal);
                else if (i < 26)
                    centerUV[i - 24] = Number(sliderVal);
                else if (i == 26)
                    scaleUV = Number(sliderVal);
                else if (i == 27)
                    eyeSeparation = Number(sliderVal);
                else if (i == 28)
                    fov = Number(sliderVal);
                else if (i == 29)
                    nearClipping = Number(sliderVal);
                else if (i == 30)
                    convergence = Number(sliderVal);
                else if (i == 31)
                    parallax = Number(sliderVal);
                setup();
            });
        }

    }
}