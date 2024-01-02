<script lang="ts">
    import type { CreateUserReq } from "$lib/dto";
    import { goto, invalidateAll } from "$app/navigation";
    import { API_URL } from "$lib";
    import { loading } from "$lib/stores";

    export let name: string;
    let newName = name;

    const gotoGames = async () => {
        $loading = true;
        await fetch(`http://${API_URL}/user`, {
            method: "POST",
            body: JSON.stringify({
                name: newName,
            } as CreateUserReq),
            credentials: "include",
        });
        await invalidateAll();
        await goto("/games");
        $loading = false;
    };

    const signOut = async () => {
        $loading = true;
        await fetch(`http://${API_URL}/logout`, {
            method: "POST",
            credentials: "include",
        });
        await invalidateAll();
        $loading = false;
    };
</script>

<div id="user">
    <h4>Play</h4>

    <form id="user-form" on:submit={gotoGames}>
        <label>
            Username
            <input
                class="form-control"
                type="text"
                placeholder="Enter your username"
                minlength="1"
                bind:value={newName}
            />
        </label>

        <div>
            <button type="submit" class="btn btn-primary">Play</button>
            <button type="button" class="btn btn-primary" on:click={signOut}
                >Sign Out</button
            >
        </div>
    </form>
</div>

<style>
    #user {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;

        border: 2px solid;
        border-radius: 0.5rem;

        height: 100%;
        width: 100%;

        padding: 1rem;
    }

    #user-form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;

        height: 100%;
        width: 100%;

        padding: 1rem;
    }
</style>
