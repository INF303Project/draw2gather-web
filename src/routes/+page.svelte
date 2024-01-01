<script lang="ts">
    import type { PageData } from "./$types";
    import QuickPlay from "$lib/components/QuickPlay.svelte";
    import ProviderSign from "$lib/components/ProviderSign.svelte";
    import UserPlay from "$lib/components/UserPlay.svelte";

    export let data: PageData;
</script>

<div id="content" class="container">
    <div class="row">
        <h2 class="text-center">Draw2Gather</h2>
    </div>

    <div id="cards" class="row">
        {#if data.user.user_id}
            <UserPlay name={data.user.name} />
        {:else}
            <div class="col-md-6">
                <QuickPlay name={data.user.name} />
            </div>
            <div class="col-md-6">
                <ProviderSign />
            </div>
        {/if}
    </div>

    <div class="row">
        <span class="text-center">Draw2Gather &copy; 2023</span>
    </div>
</div>

<style>
    #content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        height: 100%;

        padding: 1rem;
    }

    #cards {
        row-gap: 2rem;
        min-height: 50%;
    }
</style>
