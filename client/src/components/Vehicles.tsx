import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createVehicle, deleteVehicle, getVehicles, patchVehicle } from '../api/vehicles-api'
import Auth from '../auth/Auth'
import { Vehicle } from '../types/Vehicle'

interface VehiclesProps {
  auth: Auth
  history: History
}

interface VehiclesState {
  vehicles: Vehicle[]
  newMake: string
  newModel: string
  newYear: string
  newVIN: string
  newColor: string
  loadingVehicles: boolean
}

export class Vehicles extends React.PureComponent<VehiclesProps, VehiclesState> {
  state: VehiclesState = {
    vehicles: [],
    newMake: '',
    newModel: '',
    newYear: '',
    newVIN: '',
    newColor: '',
    loadingVehicles: true
  }

  handleMakeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newMake: event.target.value })
  }

  handleModelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newModel: event.target.value })
  }

  handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newYear: event.target.value })
  }

  handleVINChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newVIN: event.target.value })
  }

  handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newColor: event.target.value })
  }

  onEditButtonClick = (vehicleId: string) => {
    this.props.history.push(`/vehicles/${vehicleId}/edit`)
  }

  onVehicleCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newVehicle = await createVehicle(this.props.auth.getIdToken(), {
        make: this.state.newMake,
        model: this.state.newModel,
        year: this.state.newYear,
        VIN: this.state.newVIN,
        color: this.state.newColor,
      })
      this.setState({
        vehicles: [...this.state.vehicles, newVehicle],
        newMake: '',
        newModel: '',
        newYear: '',
        newVIN: '',
        newColor: '',
      })
    } catch(err) {
      console.log(err)
      alert('Vehicle creation failed')
    }
  }

  onVehicleDelete = async (vehicleId: string) => {
    try {
      await deleteVehicle(this.props.auth.getIdToken(), vehicleId)
      this.setState({
        vehicles: this.state.vehicles.filter(vehicle => vehicle.vehicleId !== vehicleId)
      })
    } catch (err){
      console.log(err)
      alert('Todo deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const vehicles = await getVehicles(this.props.auth.getIdToken())
      this.setState({
        vehicles,
        loadingVehicles: false
      })
    } catch (err) {
      console.log(err)
      alert(`Failed to fetch todos: ${(err as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Vehicles</Header>

        {this.renderCreateVehicleInput()}

        {this.renderVehicles()}
      </div>
    )
  }

  renderCreateVehicleInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'Make',
              onClick: this.onVehicleCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Vehicle make (manufacturer)"
            onChange={this.handleMakeChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderVehicles() {
    if (this.state.loadingVehicles) {
      return this.renderLoading()
    }

    return this.renderVehiclesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Vehicles
        </Loader>
      </Grid.Row>
    )
  }

  renderVehiclesList() {
    return (
      <Grid padded>
        {this.state.vehicles.map((vehicle, pos) => {
          return (
            <Grid.Row key={vehicle.vehicleId}>
              <Grid.Column width={10} verticalAlign="middle">
                {vehicle.make}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {vehicle.VIN}
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(vehicle.vehicleId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onVehicleDelete(vehicle.vehicleId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {vehicle.attachmentUrl && (
                <Image src={vehicle.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
