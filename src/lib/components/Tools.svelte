<script lang="ts">
    import {
        CircleDraw,
        CircleFill,
        Eraser,
        FreeDraw,
        LineDraw,
        RectDraw,
        RectFill,
        ColorPicker,
    } from "$lib/utility";
    import {
        boardColor,
        pencilWidth,
        eraserWidth,
        game,
        utility,
    } from "$lib/stores";

    import stylus from "$lib/assets/stylus.svg";
    import eraser from "$lib/assets/eraser.svg";
    import picker from "$lib/assets/picker.svg";
    import line from "$lib/assets/line.svg";
    import rect from "$lib/assets/rect.svg";
    import rect_fill from "$lib/assets/rect_fill.svg";
    import circle from "$lib/assets/circle.svg";
    import circle_fill from "$lib/assets/circle_fill.svg";
    import blank from "$lib/assets/page.svg";
    import save from "$lib/assets/download.svg";
    import palette from "$lib/assets/palette.svg";

    let current_selected: HTMLElement | null = null;

    const changeUtil = (event: Event) => {
        const target = (event.target as HTMLElement)
            .parentElement as HTMLButtonElement;
        const value = target.value;

        if (current_selected) {
            current_selected.style.backgroundColor = "transparent";
        }
        current_selected = target;
        current_selected.style.backgroundColor = "#ccc";

        switch (value) {
            case "FreeDraw":
                $utility = new FreeDraw();
                break;
            case "Eraser":
                $utility = new Eraser();
                break;
            case "ColorPicker":
                $utility = new ColorPicker();
                break;
            case "LineDraw":
                $utility = new LineDraw();
                break;
            case "RectDraw":
                $utility = new RectDraw();
                break;
            case "RectFill":
                $utility = new RectFill();
                break;
            case "CircleDraw":
                $utility = new CircleDraw();
                break;
            case "CircleFill":
                $utility = new CircleFill();
                break;
        }
    };

    const changeColor = (event: Event) => {
        const value = (event.target as HTMLInputElement).value;
        $game?.changeColor(value);
    };

    const changePencilSize = (event: Event) => {
        const value = Number((event.target as HTMLInputElement).value);
        $game?.changeLineWidth(value);
    };

    const changeEraserSize = (event: Event) => {
        const value = Number((event.target as HTMLInputElement).value);
        $game?.changeEraserWidth(value);
    };
</script>

<div id="tools">
    <div>
        <button on:click={changeUtil} value="FreeDraw">
            <img src={stylus} alt="Stylus" />
        </button>
        <button on:click={changeUtil} value="Eraser">
            <img src={eraser} alt="Eraser" />
        </button>
    </div>

    <div>
        <button on:click={changeUtil} value="ColorPicker">
            <img src={picker} alt="Color Picker" />
        </button>
        <button on:click={changeUtil} value="LineDraw">
            <img src={line} alt="Line Draw" />
        </button>
    </div>

    <div>
        <button on:click={changeUtil} value="RectDraw">
            <img src={rect} alt="Rectangle Draw" />
        </button>
        <button on:click={changeUtil} value="RectFill">
            <img src={rect_fill} alt="Rectangle Fill" />
        </button>
    </div>

    <div>
        <button on:click={changeUtil} value="CircleDraw">
            <img src={circle} alt="Circle Draw" />
        </button>
        <button on:click={changeUtil} value="CircleFill">
            <img src={circle_fill} alt="Circle Fill" />
        </button>
    </div>

    <div>
        <button>
            <input
                id="colorPicker"
                type="color"
                style="position: absolute; opacity: 0; width: 24px; height: 24px;"
                on:change={changeColor}
            />
            <img src={palette} alt="Color Palette" />
        </button>
        <button
            disabled
            style="background-color: {$boardColor}; cursor: default;"
        ></button>
    </div>

    <div>
        <button on:click={$game?.clearBoard}>
            <img src={blank} alt="Clear" />
        </button>
        <button on:click={$game?.saveImage}>
            <img src={save} alt="Download" />
        </button>
    </div>

    <div>
        <div class="hor">
            <img src={stylus} alt="Stylus" />
            <input
                type="range"
                min="2"
                max="10"
                orient="vertical"
                bind:value={$pencilWidth}
                on:change={changePencilSize}
            />
        </div>

        <div class="hor">
            <img src={eraser} alt="Eraser" />
            <input
                type="range"
                min="10"
                max="50"
                step="5"
                orient="vertical"
                bind:value={$eraserWidth}
                on:change={changeEraserSize}
            />
        </div>
    </div>
</div>

<style>
    #tools {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    #tools div {
        display: flex;
        flex-direction: row;
    }

    #tools div.hor {
        flex-direction: column;
        align-items: center;
    }

    #tools div button {
        all: unset;
        cursor: pointer;

        display: flex;
        justify-content: center;
        align-items: center;

        border: 1px solid;
        background-color: transparent;

        width: 24px;
        height: 24px;
    }

    #tools div button :hover {
        background-color: #ccc;
    }

    #tools input[type="range"] {
        width: 24px;
        height: 96px;
        -webkit-appearance: slider-vertical;
    }

    #tools input[type="color"] {
        cursor: pointer;
    }
</style>
