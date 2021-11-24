export function getRoutes() {
  const routes = [
  {
    &quot;path&quot;: &quot;&#x2F;&quot;,
    &quot;meta&quot;: {},
    &quot;component&quot;: {
      &quot;default&quot;: &quot;default: import(default)&quot;
    }
  },
  {
    &quot;path&quot;: &quot;&#x2F;test&quot;,
    &quot;meta&quot;: {},
    &quot;component&quot;: {
      &quot;default&quot;: &quot;default: import(default)&quot;
    }
  },
  {
    &quot;path&quot;: &quot;&#x2F;users&quot;,
    &quot;meta&quot;: {},
    &quot;routes&quot;: [
      {
        &quot;path&quot;: &quot;&#x2F;users&#x2F;user&quot;,
        &quot;meta&quot;: {},
        &quot;component&quot;: {
          &quot;default&quot;: &quot;default: import(default)&quot;
        }
      }
    ]
  }
];
  return routes;
}