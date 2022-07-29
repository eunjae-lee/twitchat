<script lang="ts">
	import { session } from '$app/stores';
</script>

<h1>Welcome {$session.user.email}</h1>
<p>I am always logged in!</p>
