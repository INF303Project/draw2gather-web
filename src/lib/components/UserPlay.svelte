<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    import { API_URL } from "$lib";
    import type { CreateUserReq } from "$lib/dto";

    export let username: string;

    const gotoGames = async () => {
        try {
            await fetch(`http://${API_URL}/user`, {
                method: "POST",
                body: JSON.stringify({
                    name: username,
                } as CreateUserReq),
                credentials: "include",
            });
            await goto("/games");
        } catch (err) {
            console.error(err);
        }
    };

    const signOut = async () => {
        await fetch(`http://${API_URL}/logout`, {
            method: "POST",
            credentials: "include",
        });
        invalidateAll();
    };
</script>

<div id="user">
    <h4>Play</h4>

    <div id="user-form">
        <label>
            Username
            <input
                class="form-control"
                type="text"
                placeholder="Enter your username"
                minlength="1"
                bind:value={username}
            />
        </label>

        <div>
            <button class="btn btn-primary" on:click={gotoGames}>Play</button>
            <button class="btn btn-primary" on:click={signOut}>Sign Out</button>
        </div>
    </div>
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
