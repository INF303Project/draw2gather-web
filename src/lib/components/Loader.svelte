<script lang="ts">
</script>

<div id="loader">
    <div class="spinner"></div>
</div>

<style>
    #loader {
        display: flex;
        justify-content: center;
        align-items: center;

        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        background-color: lightgray;
        opacity: 0.5;

        width: 100%;
        height: 100%;
        z-index: 9999;
    }

    .spinner {
        border: 0.5rem solid #f3f3f3; /* Light grey */
        border-top: 0.5rem solid #3498db; /* Blue */
        border-radius: 50%;
        width: 5rem;
        height: 5rem;
        animation: spin 2s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
