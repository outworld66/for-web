import { onMount, Show, createSignal } from "solid-js";
import { Trans } from "@lingui/solid/macro";

import { useClientLifecycle } from "@revolt/client";
import { useModals } from "@revolt/modal";
import { Button } from "@revolt/ui";
import { useNavigate } from "@revolt/routing";
import { FlowTitle } from "./Flow";

export default function FlowOIDC() {
  const modals = useModals();
  const navigate = useNavigate();
  const { loginOIDC } = useClientLifecycle();
  const [error, setError] = createSignal(false);

  onMount(() => {
    const params = new URLSearchParams(location.hash.slice(1));
    const ticket = params.get("ticket");
    history.replaceState(null, "", `${location.pathname}${location.search}`);
    if (!ticket) {
      setError(true);
      return;
    }

    void loginOIDC(ticket, modals)
      .then(() => navigate("/login/auth", { replace: true }))
      .catch((reason) => {
        console.error("OIDC login failed:", reason);
        setError(true);
      });
  });

  return (
    <Show
      when={error()}
      fallback={
        <FlowTitle subtitle={<Trans>Completing single sign-on…</Trans>}>
          <Trans>Signing in</Trans>
        </FlowTitle>
      }
    >
      <FlowTitle subtitle={<Trans>Check your account and try again.</Trans>}>
        <Trans>Single sign-on failed</Trans>
      </FlowTitle>
      <Button onPress={() => navigate("/login/auth", { replace: true })}>
        <Trans>Back to login</Trans>
      </Button>
    </Show>
  );
}
