<script lang="ts">
    import { goto } from "$app/navigation";

    export let username: string;

    const gotoGames = async () => {
        try {
            await fetch("http://192.168.0.10:8080/user", {
                method: "POST",
                body: JSON.stringify({
                    name: username,
                }),
                credentials: "include",
            });
            await goto("/games");
        } catch (err) {
            console.error(err);
        }
    };
</script>

<div id="anonymous">
    <h4>Quick Play</h4>

    <div id="anon-form">
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
    </div>

    <button class="btn btn-primary" on:click={gotoGames}>Play</button>
</div>

<style>
    #anonymous {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        border: 2px solid;
        border-radius: 0.5rem;

        height: 100%;
        width: 100%;

        padding: 1rem;
    }

    #anon-form {
        margin-top: 1rem;
        margin-bottom: 1rem;
    }
</style>
