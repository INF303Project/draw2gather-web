<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { API_URL } from "$lib";
    import google from "$lib/assets/google.svg";
    import { auth, googleProvider } from "$lib/auth";
    import { loading } from "$lib/stores";
    import { signInWithPopup } from "firebase/auth";

    const googleSignIn = async () => {
        const user = await signInWithPopup(auth, googleProvider);
        const token = await user.user.getIdToken();
        $loading = true;
        await fetch(`http://${API_URL}/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        await invalidateAll();
        $loading = false;
    };
</script>

<div id="providers">
    <div style="text-align: center;">
        <h4>Sign In With Providers</h4>
        <p>Sign in to create new sets</p>
    </div>

    <div
        class="d-flex flex-column justify-content-center align-items-center h-100"
    >
        <button class="btn" on:click={googleSignIn}>
            <img src={google} alt="Sign in with Google" />
        </button>
    </div>
</div>

<style>
    #providers {
        display: flex;
        flex-direction: column;
        align-items: center;

        border: 2px solid;
        border-radius: 0.5rem;

        height: 100%;
        width: 100%;

        padding: 1rem;
    }
</style>
