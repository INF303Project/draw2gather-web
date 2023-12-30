<script lang="ts">
    import {
        Board,
        DEFAULT_DRAW_COLOR,
        DEFAULT_ERASER_WIDTH,
        DEFAULT_LINE_WIDTH,
    } from "$lib/board";
    import { utility } from "$lib/stores";
    import { onMount } from "svelte";

    onMount(() => {
        const board = Board.getInstance();
        board.changeColor(DEFAULT_DRAW_COLOR);
        board.changeLineWidth(DEFAULT_LINE_WIDTH);
        board.changeEraserWidth(DEFAULT_ERASER_WIDTH);
    });
</script>

<div id="board" class="d-none">
    <canvas
        id="front"
        width="1024"
        height="576"
        on:mousedown={$utility?.onMouseDown}
        on:mousemove={$utility?.onMouseMove}
        on:mouseup={$utility?.onMouseUp}
        on:mouseleave={$utility?.onMouseLeave}
        on:touchstart={$utility?.onTouchStart}
        on:touchmove={$utility?.onTouchMove}
        on:touchend={$utility?.onTouchEnd}
        on:touchcancel={$utility?.onTouchCancel}
    />
    <canvas id="back" width="1024" height="576" />
</div>

<style>
    #board {
        position: relative;
        width: 100%;
    }

    #front {
        background: transparent;
    }

    #back {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
    }

    #board canvas {
        border: 2px solid;
        cursor: crosshair;

        aspect-ratio: 16/9;
        width: 100%;
    }
</style>
