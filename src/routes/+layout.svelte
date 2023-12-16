<script>
    import ScreenAdjust from "$lib/components/ScreenAdjust.svelte";
</script>

<div id="blocker">
    <ScreenAdjust />
</div>

<div id="content">
    <slot />
</div>

<style>
    #blocker {
        display: none;
    }

    #content {
        display: contents;
    }

    @media screen and (max-width: 992px) and (orientation: landscape) {
        #blocker {
            display: contents;
        }
        #content {
            display: none;
        }
    }
</style>
