<script>
    import { navigating, page } from "$app/stores";
    import { loading } from "$lib/stores";
    import Error from "$lib/components/Error.svelte";
    import Loader from "$lib/components/Loader.svelte";
    import ScreenAdjust from "$lib/components/ScreenAdjust.svelte";
</script>

{#if $page.error}
    <Error />
{:else}
    <div id="blocker">
        <ScreenAdjust />
    </div>

    <div id="content">
        {#if $navigating || $loading}
            <Loader />
        {/if}
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
