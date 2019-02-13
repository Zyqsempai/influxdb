// Libraries
import React, {PureComponent} from 'react'

// Components
import {OverlayContainer, OverlayBody, OverlayHeading} from 'src/clockface'
import PermissionsWidget, {
  PermissionsWidgetMode,
  PermissionsWidgetSelection,
} from 'src/shared/components/permissionsWidget/PermissionsWidget'
import CopyText from 'src/shared/components/CopyText'

// Types
import {Authorization, Permission} from '@influxdata/influx'

// Actions
import {NotificationAction} from 'src/types'

interface Props {
  onNotify: NotificationAction
  auth: Authorization
  onDismissOverlay: () => void
}

export default class ViewTokenOverlay extends PureComponent<Props> {
  public render() {
    const {description, permissions} = this.props.auth
    const {onNotify} = this.props

    const obj = {}
    for (const key of permissions) {
      if (obj[key.resource.type]) {
        obj[key.resource.type].push(key.action)
      } else {
        obj[key.resource.type] = [key.action]
      }
    }

    return (
      <OverlayContainer>
        <OverlayHeading title={description} onDismiss={this.handleDismiss} />
        <OverlayBody>
          <CopyText copyText={this.props.auth.token} notify={onNotify} />
          <PermissionsWidget
            mode={PermissionsWidgetMode.Read}
            heightPixels={500}
          >
            {Object.keys(obj).map((p, i) => {
              return (
                <PermissionsWidget.Section
                  key={i}
                  id={p}
                  title={this.title(p)}
                  mode={PermissionsWidgetMode.Read}
                >
                  {obj[p].map((a, i) => (
                    <PermissionsWidget.Item
                      key={i}
                      id={this.itemID(p, a)}
                      label={a}
                      selected={PermissionsWidgetSelection.Selected}
                    />
                  ))}
                </PermissionsWidget.Section>
              )
            })}
          </PermissionsWidget>
        </OverlayBody>
      </OverlayContainer>
    )
  }

  private itemID = (
    permission: string,
    action: Permission.ActionEnum
  ): string => {
    return `${permission}-${action}-${permission || '*'}-${permission || '*'}`
  }

  private title = (permission: string): string => {
    return `${permission}:*`
  }

  private handleDismiss = () => {
    this.props.onDismissOverlay()
  }
}
