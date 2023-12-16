<script lang="ts">
    import google from "$lib/assets/google.png";
</script>

<div id="providers">
    <div style="text-align: center;">
        <h4>Sign In With Providers</h4>
        <p>Sign in to create new sets</p>
    </div>

    <button class="btn">
        <img src={google} alt="Sign in with Google" />
    </button>
</div>

<style>
    #providers {
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
</style>
