<script lang="ts">
    import { FreeDraw } from "$lib/board_utils";
    import { boardUtility } from "$lib/stores";
    import { onMount } from "svelte";

    onMount(() => {
        boardUtility.set(FreeDraw.getInstance());
    });
</script>

<div id="board">
    <div id="drawing">
        <canvas
            id="front"
            width="1024"
            height="576"
            on:mousedown={$boardUtility.onMouseDown}
            on:mousemove={$boardUtility.onMouseMove}
            on:mouseup={$boardUtility.onMouseUp}
            on:mouseleave={$boardUtility.onMouseLeave}
            on:touchstart={$boardUtility.onTouchStart}
            on:touchmove={$boardUtility.onTouchMove}
            on:touchend={$boardUtility.onTouchEnd}
            on:touchcancel={$boardUtility.onTouchCancel}
        />
        <canvas id="back" width="1024" height="576" />
    </div>
</div>

<style>
    #drawing {
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

    #drawing canvas {
        border: 2px solid;
        cursor: crosshair;

        aspect-ratio: 16/9;
        width: 100%;
    }
</style>
