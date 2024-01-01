<script>
    import { page } from "$app/stores";
    import Error from "$lib/components/Error.svelte";
    import ScreenAdjust from "$lib/components/ScreenAdjust.svelte";
</script>

{#if $page.error}
    <Error />
{:else}
    <div id="blocker">
        <ScreenAdjust />
    </div>

    <div id="content">
        <slot />
    </div>
{/if}

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
