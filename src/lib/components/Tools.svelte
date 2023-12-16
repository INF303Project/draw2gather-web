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
    } from "$lib/board_utils";
    import type { Utility } from "$lib/board_utils";
    import { boardColor, pencilWidth, eraserWidth } from "$lib/stores";

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
    import { boardUtility } from "$lib/stores";

    let current_selected: HTMLElement | null = null;

    boardUtility.subscribe((utility) => {
        if (current_selected) {
            current_selected.style.backgroundColor = "transparent";
        }

        if (utility) {
            const tool = document.querySelector(
                `#tools button[value="${utility.type}"]`,
            ) as HTMLInputElement;
            if (tool) {
                current_selected = tool;
                current_selected.style.backgroundColor = "#ccc";
            }
        }
    });

    const changeUtil = (e: Event) => {
        const target = (e.target as HTMLElement)
            .parentElement as HTMLInputElement;
        const value = target.value as Utility;

        if (value == "FreeDraw") {
            boardUtility.set(FreeDraw.getInstance());
        } else if (value == "Eraser") {
            boardUtility.set(Eraser.getInstance());
        } else if (value == "ColorPicker") {
            boardUtility.set(ColorPicker.getInstance());
        } else if (value == "LineDraw") {
            boardUtility.set(LineDraw.getInstance());
        } else if (value == "RectDraw") {
            boardUtility.set(RectDraw.getInstance());
        } else if (value == "RectFill") {
            boardUtility.set(RectFill.getInstance());
        } else if (value == "CircleDraw") {
            boardUtility.set(CircleDraw.getInstance());
        } else if (value == "CircleFill") {
            boardUtility.set(CircleFill.getInstance());
        }

        if (current_selected) {
            current_selected.style.backgroundColor = "transparent";
        }

        current_selected = target;
        current_selected.style.backgroundColor = "#ccc";
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
                on:change={(e) => $boardUtility.changeColor(e)}
            />
            <img src={palette} alt="Color Palette" />
        </button>
        <button
            disabled
            style="background-color: {$boardColor}; cursor: default;"
        ></button>
    </div>

    <div>
        <button
            on:click={(_) => {
                $boardUtility.clear();
            }}
        >
            <img src={blank} alt="Clear" />
        </button>
        <button on:click={(_) => $boardUtility.save()}>
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
                on:change={(e) => $boardUtility.changePencilSize(e)}
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
                on:change={(e) => {
                    $boardUtility.changeEraserSize(e);
                }}
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

    #tools button {
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

    #tools button :hover {
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
